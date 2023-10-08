import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { PixWebhookRequest } from '../../@types/efipay'
import { PixEventUseCase } from '../../useCases/efipay/PixEventUseCase'
import { prisma } from '../../prisma'

class EfiPayController {
  async webhook(request: Request, response: Response) {
    await prisma.efiWebhookEvent.create({
      data: { event: request.body as Prisma.JsonObject },
    })

    const { pix } = request.body as PixWebhookRequest

    if (!pix) {
      return response.status(204).send()
    }

    for (const pixEvent of pix) {
      await PixEventUseCase.handle(pixEvent)
    }

    return response.status(200).send()
  }
}

export default new EfiPayController()
