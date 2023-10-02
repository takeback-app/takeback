import EfipaySdk from 'sdk-typescript-apis-efi'
import { Decimal } from '@prisma/client/runtime/library'
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
  protected tax: number
  protected pixKey: string

  constructor() {
    this.efipaySdk = new EfipaySdk(config)
    this.pixKey = process.env.EFI_PIX_KEY || ''
    this.tax = 0.02
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
    } = dto

    const money = new Decimal(value).times(1 + this.tax)

    const body: PixCreateImmediateChargeBody = {
      calendario: { expiracao: expirationInSeconds },
      chave: this.pixKey,
      devedor: { [documentKey]: document, nome: name },
      valor: { original: money.toFixed(2) },
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
