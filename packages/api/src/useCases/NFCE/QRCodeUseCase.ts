import axios from 'axios'
import { load } from 'cheerio'
import { DateTime } from 'luxon'
import { NFCePaymentMethod, QRCode } from '@prisma/client'
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
        await prisma.qRCode.update({
          where: { id: this.qrCode.id },
          data: {
            type: 'NOT_VALIDATED',
            description:
              'Cupom descartado. A compra foi feita a mais de 24 hrs.',
          },
        })

        return false
      }

      const nfcePayments = $('div.row > div > strong')
        .map((i, el) => $(el).text())
        .splice(4) // Remove os 4 primeiros textos sem valor
        .filter((_, i) => i % 2 === 1) // Remove as labels deixando somente os valores
        // Transforma o Array em Objeto. Ex: ["3.00", "01 - Dinheiro", "2.20", "17 - Pix"] => [{ value: 3, tPag: 1}, { value: 2.2, tPag: 17 }]
        .reduce((acc, val, i, arr) => {
          if (i % 2 === 0) {
            const nextString = arr[i + 1] as string

            const tPag = nextString ? Number(nextString.split(' - ')[0]) : 17 // Se vier vazio coloca como "17 - Pix"
            const vPag = Number(val)

            acc.push({
              value: vPag,
              method: getNFCePaymentMethod(tPag),
              tPag,
            })
          }

          return acc
        }, [])

      const company = await prisma.company.findFirst({
        select: { id: true },
        where: { registeredNumber: cnpj, id: this.qrCode.companyId },
      })

      if (!company) {
        await prisma.qRCode.update({
          where: { id: this.qrCode.id },
          data: {
            type: 'NOT_VALIDATED',
            description: 'Cupom não valido para empresa solicitada',
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
        data: { retries: this.qrCode.retries + 1 },
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
        await prisma.qRCode.update({
          where: { id: this.qrCode.id },
          data: {
            type: 'NOT_VALIDATED',
            description: 'Cupom não valido. Forma de pagamento não cadastrada',
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
        companyUserId,
        consumerId: this.qrCode.consumerId,
        createdAt: issuedAt,
        totalAmount: totalAmount.toNumber(),
        paymentMethods,
      })
    }

    // const nfce = await prisma.nFCe.create({
    //   data: {
    //     path,
    //     companyId,
    //     issuedAt,
    //     nfcePayments: { createMany: { data: nfcePayments } },
    //   },
    // })

    // await prisma.transaction.update({
    //   where: { id: transaction.id },
    //   data: {
    //     nfceId: nfce.id,
    //     nfceValidationStatus: NFCeValidationStatus.VALIDATED,
    //   },
    // })

    await prisma.qRCode.update({
      where: { id: this.qrCode.id },
      data: { type: 'VALIDATED' },
    })

    return transaction
  }
}
