import axios from 'axios'
import { load } from 'cheerio'
import { DateTime } from 'luxon'
import {
  NFCePaymentMethod,
  NFCeQRCode,
  NFCeValidationStatus,
} from '@prisma/client'
import { getNFCePaymentMethod } from '../../enum/NfcePaymentMethodEnum'
import { prisma } from '../../prisma'
import { GenerateCashbackUseCase } from '../cashback/GenerateCashbackUseCase'

interface NfceData {
  path: string
  issuedAt: Date
  nfcePayments: { value: number; method: NFCePaymentMethod; tPag: number }[]
}

interface PaymentMethod {
  id: number
  value: number
}

export class NfceQRCode {
  protected generateCashbackUseCase: GenerateCashbackUseCase

  constructor(private qrCode: NFCeQRCode) {
    this.generateCashbackUseCase = new GenerateCashbackUseCase()
  }

  public static makeFromLink(qrCode: NFCeQRCode) {
    return new NfceQRCode(qrCode)
  }

  private async getHtml() {
    try {
      const { data } = await axios.get<string>(this.qrCode.link)

      return load(data)
    } catch (error) {
      throw new Error('Problema com o link')
    }
  }

  public async createNfce() {
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
      ).toJSDate()

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
        where: {
          registeredNumber: cnpj,
          integrationSettings: { type: 'QRCODE' },
        },
      })

      if (!company) {
        await prisma.nFCeQRCode.update({
          where: { id: this.qrCode.id },
          data: { type: 'NOT_VALIDATED' },
        })

        return false
      }

      return await this.saveNfce(company.id, {
        path: 'QRCODE',
        issuedAt,
        nfcePayments,
      })
    } catch (e) {
      await prisma.nFCeQRCode.update({
        where: { id: this.qrCode.id },
        data: { retries: this.qrCode.retries + 1 },
      })

      return false
    }
  }

  public async saveNfce(
    companyId: string,
    { issuedAt, nfcePayments, path }: NfceData,
    companyUserId?: string,
  ) {
    const paymentMethods: PaymentMethod[] = []

    let totalAmount = 0

    for (const nfcePayment of nfcePayments) {
      totalAmount += nfcePayment.value

      const { id } = await prisma.companyPaymentMethod.findFirstOrThrow({
        select: { id: true },
        where: { companyId, tPag: nfcePayment.tPag },
      })

      paymentMethods.push({ id, value: nfcePayment.value })
    }

    const transaction = await this.generateCashbackUseCase.execute({
      companyId,
      companyUserId,
      consumerId: this.qrCode.consumerId,
      totalAmount,
      paymentMethods,
    })

    const nfce = await prisma.nFCe.create({
      data: {
        path,
        companyId,
        issuedAt,
        nfcePayments: { createMany: { data: nfcePayments } },
      },
    })

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        nfceId: nfce.id,
        nfceValidationStatus: NFCeValidationStatus.VALIDATED,
      },
    })

    await prisma.nFCeQRCode.update({
      where: { id: this.qrCode.id },
      data: { type: 'VALIDATED' },
    })

    return nfce
  }
}
