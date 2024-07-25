import EfipaySdk from 'sdk-typescript-apis-efi'
import { Decimal } from '@prisma/client/runtime/library'
import fs from 'fs'
import path from 'path'
import config from '../config/efipay'
import {
  ErrorReturn,
  PixCreateImmediateChargeBody,
  PixCreateImmediateChargeDTO,
  PixCreateImmediateChargeReturn,
  PixGenerateQRCodeReturn,
} from '../@types/efipay'

type ReturnDTO<T> =
  | {
      isOK: true
      response: T
    }
  | { isOK: false; response: ErrorReturn }

export class Efipay {
  protected efipaySdk: EfipaySdk
  protected pixKey: string

  constructor() {
    const p12FileName = process.env.EFI_CERT_FILE_NAME
    const p12FilePath = path.resolve(__dirname, p12FileName)

    if (!fs.existsSync(p12FilePath)) {
      const base64Data = process.env.EFI_CERT_BASE64 || ''
      if (base64Data) {
        const buffer = Buffer.from(base64Data, 'base64')
        fs.writeFileSync(p12FilePath, buffer)
      } else {
        throw new Error('Certificado não encontrado')
      }
    }

    this.efipaySdk = new EfipaySdk({ ...config, pix_cert: p12FilePath })
    this.pixKey = process.env.EFI_PIX_KEY || ''
  }

  public static make() {
    return new Efipay()
  }

  public async pixCreateImmediateCharge(
    dto: PixCreateImmediateChargeDTO,
  ): Promise<ReturnDTO<PixCreateImmediateChargeReturn>> {
    const {
      document,
      documentKey = 'cpf',
      name,
      value,
      expirationInSeconds = 3600,
      message,
      tax,
      bankTax,
    } = dto

    const money = new Decimal(value).times(1 + tax)
    const moneyWithBankTax = money.dividedBy(1 - bankTax)

    const body: PixCreateImmediateChargeBody = {
      calendario: { expiracao: expirationInSeconds },
      chave: this.pixKey,
      devedor: { [documentKey]: document, nome: name },
      valor: { original: moneyWithBankTax.toFixed(2) },
      solicitacaoPagador: message,
    }

    try {
      const response = await this.efipaySdk.pixCreateImmediateCharge([], body)

      return { isOK: true, response }
    } catch (err) {
      return { isOK: false, response: err }
    }
  }

  public async pixGenerateQRCode(
    locId: number,
  ): Promise<ReturnDTO<PixGenerateQRCodeReturn>> {
    try {
      const response = await this.efipaySdk.pixGenerateQRCode({ id: locId })

      return { isOK: true, response }
    } catch (err) {
      return { isOK: false, response: err }
    }
  }

  public async pixConfigWebhook(baseUrl: string) {
    const webhookUrl = new URL(baseUrl)

    webhookUrl.searchParams.append('hmac', process.env.EFI_WEBHOOK_HMAC)
    webhookUrl.searchParams.append('ignora', '')

    const params = { chave: this.pixKey }
    const body = { webhookUrl: webhookUrl.href }

    try {
      const response = await this.efipaySdk.pixConfigWebhook(params, body)

      return { isOK: true, response }
    } catch (err) {
      return { isOK: false, response: err }
    }
  }

  public async pixDeleteWebhook() {
    const params = { chave: this.pixKey }

    try {
      const response = await this.efipaySdk.pixDeleteWebhook(params)

      return { isOK: true, response }
    } catch (err) {
      return { isOK: false, response: err }
    }
  }
}
