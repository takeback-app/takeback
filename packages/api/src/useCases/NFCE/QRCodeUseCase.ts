import axios from 'axios'
import { CheerioAPI, load } from 'cheerio'
import { DateTime } from 'luxon'
import { NFCePaymentMethod, QRCode, TransactionSource } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { getNFCePaymentMethod } from '../../enum/NfcePaymentMethodEnum'
import { prisma } from '../../prisma'
import { GenerateCashbackUseCase } from '../cashback/GenerateCashbackUseCase'

interface NfceData {
  issuedAt: Date
  nfcePayments: { value: number; method: NFCePaymentMethod; tPag: number }[]
}

interface PaymentMethod {
  id: number
  value: number
}

export class QRCodeUseCase {
  protected generateCashbackUseCase: GenerateCashbackUseCase

  constructor(private qrCode: QRCode) {
    this.generateCashbackUseCase = new GenerateCashbackUseCase()
  }

  public static makeFromLink(qrCode: QRCode) {
    return new QRCodeUseCase(qrCode)
  }

  private async getHtml() {
    try {
      const { data } = await axios.get<string>(this.qrCode.link)

      return load(data)
    } catch (error) {
      throw new Error('Problema com o link')
    }
  }

  public async createTransaction() {
    try {
      const $ = await this.getHtml()

      const cnpj = $('table.text-center > tbody > tr:first-child > td')
        .text()
        .split(' ')[1]
        .replace(/\D/g, '')

      const issuedAtString = $(
        'table.table-hover:nth-child(8) > tbody > tr:first-child > td:last-child',
      ).text()

      const issuedAt = DateTime.fromFormat(
        issuedAtString,
        'dd/MM/yyyy HH:mm:ss',
        { zone: 'UTC-3' },
      )

      const diffNow = DateTime.now().diff(issuedAt).as('days')

      if (diffNow >= 1) {
        const error = 'Cupom descartado. A compra foi feita a mais de 24 hrs.'
        await prisma.qRCode.update({
          where: { id: this.qrCode.id },
          data: {
            type: 'NOT_VALIDATED',
            description: error,
            errors: { push: error },
          },
        })

        return false
      }

      const nfcePayments = await this.getNfcePayments($)

      const company = await prisma.company.findFirst({
        select: { id: true },
        where: { registeredNumber: cnpj, id: this.qrCode.companyId },
      })

      if (!company) {
        const error = 'Cupom não valido para empresa solicitada'
        await prisma.qRCode.update({
          where: { id: this.qrCode.id },
          data: {
            type: 'NOT_VALIDATED',
            description: error,
            errors: { push: error },
          },
        })
        return false
      }

      const transaction = await this.saveTransaction(
        company.id,
        {
          issuedAt: issuedAt.toJSDate(),
          nfcePayments,
        },
        this.qrCode.companyUserId,
      )

      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { qrCodeId: this.qrCode.id, nfceValidationStatus: 'VALIDATED' },
      })

      return transaction
    } catch (e) {
      await prisma.qRCode.update({
        where: { id: this.qrCode.id },
        data: {
          retries: this.qrCode.retries + 1,
          errors: { push: e.message },
        },
      })

      return false
    }
  }

  public async saveTransaction(
    companyId: string,
    { issuedAt, nfcePayments }: NfceData,
    companyUserId?: string,
  ) {
    const paymentMethods: PaymentMethod[] = []

    let totalAmount = new Decimal(0.0)

    for (const nfcePayment of nfcePayments) {
      totalAmount = totalAmount.plus(nfcePayment.value)

      const companyPaymentMethod =
        await prisma.companyPaymentMethod.findFirstOrThrow({
          select: { id: true },
          where: { companyId, tPag: nfcePayment.tPag },
        })

      if (!companyPaymentMethod) {
        const error = 'Cupom não valido. Forma de pagamento não cadastrada'
        await prisma.qRCode.update({
          where: { id: this.qrCode.id },
          data: {
            type: 'NOT_VALIDATED',
            description: error,
            errors: { push: error },
          },
        })
      }

      paymentMethods.push({
        id: companyPaymentMethod.id,
        value: nfcePayment.value,
      })
    }

    let transaction = await prisma.transaction.findFirst({
      where: {
        companiesId: companyId,
        consumersId: this.qrCode.consumerId,
        totalAmount,
        createdAt: { gte: DateTime.now().minus({ days: 1 }).toJSDate() },
      },
    })

    if (!transaction) {
      transaction = await this.generateCashbackUseCase.execute({
        companyId,
        companyUserId: companyUserId || undefined,
        consumerId: this.qrCode.consumerId,
        createdAt: issuedAt,
        totalAmount: totalAmount.toNumber(),
        paymentMethods,
        transactionSource: TransactionSource.APP,
      })
    }

    await prisma.qRCode.update({
      where: { id: this.qrCode.id },
      data: { type: 'VALIDATED' },
    })

    return transaction
  }

  private async getNfcePayments($: CheerioAPI) {
    const elementsArray = $('div.row > div > strong')
      .map((_, el) => $(el).text())
      .splice(0)
      .filter((_, i) => i % 2 === 1) // Remove as labels deixando somente os valores

    const nfcePayments = []
    // Os dois primeiro itens são quantidade e total
    const quantityAndTotal = elementsArray.slice(0, 2)
    // O restante dos itens é o método de pagamento e o valor pago com o médodo
    const paymentMethods = elementsArray.slice(2)

    const totalValue = paymentMethods.reduce(
      (acc, curr, index) => (index % 2 === 0 ? acc + parseFloat(curr) : acc),
      0,
    )

    const diffValue = totalValue - Number(quantityAndTotal[1])
    const isMatchTotalValue = !diffValue

    // Transforma o Array em Objeto. Ex: ["3.00", "01 - Dinheiro", "2.20", "17 - Pix"] => [{ value: 3, tPag: 1}, { value: 2.2, tPag: 17 }]
    for (let i = 0; i < paymentMethods.length; i += 2) {
      const value = paymentMethods[i]
      const paymentMethod = paymentMethods[i + 1]
      // Se vier vazio coloca como "17 - Pix"
      const tPag = paymentMethod ? Number(paymentMethod.split(' - ')[0]) : 17
      const method = getNFCePaymentMethod(tPag)
      let vPag = Number(value)

      if (!isMatchTotalValue && method === NFCePaymentMethod.CASH) {
        vPag -= diffValue
      }

      nfcePayments.push({
        value: vPag,
        method,
        tPag,
      })
    }

    return nfcePayments
  }
}
