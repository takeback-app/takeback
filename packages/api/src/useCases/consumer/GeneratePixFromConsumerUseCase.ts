import { Decimal } from '@prisma/client/runtime/library'
import { Prisma } from '@prisma/client'
import { prisma } from '../../prisma'
import { Efipay } from '../../services/efipay'

export class GeneratePixFromConsumerUseCase {
  public static async create(consumerId: string, value: number) {
    const consumer = await prisma.consumer.findUniqueOrThrow({
      where: { id: consumerId },
    })

    const { depositFeePercentage, bankPixFeePercentage } =
      await prisma.setting.findFirst()

    const efiPay = Efipay.make()

    const { isOK, response } = await efiPay.pixCreateImmediateCharge({
      document: consumer.cpf,
      name: consumer.fullName,
      value,
      tax: +depositFeePercentage,
      bankTax: +bankPixFeePercentage,
    })

    console.log('pixCreateImmediateCharge', { isOK, response })

    if (!isOK) {
      return null
    }

    const { isOK: isQRCodeOk, response: qrCodeResponse } =
      await efiPay.pixGenerateQRCode(response.loc.id)

    console.log('pixGenerateQRCode', { isQRCodeOk, qrCodeResponse })

    if (!isQRCodeOk) {
      return null
    }

    return prisma.pixTransaction.create({
      data: {
        data: {
          pixCreateImmediateCharge: response,
          linkVisualizacao: qrCodeResponse.linkVisualizacao,
        } as unknown as Prisma.JsonObject,
        reference: consumer.cpf,
        txId: response.txid,
        locId: response.loc.id,
        copiaCola: qrCodeResponse.qrcode,
        qrCodeImage: qrCodeResponse.imagemQrcode,
        value: new Decimal(response.valor.original),
      },
    })
  }
}
