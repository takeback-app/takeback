import { Request, Response } from 'express'
import { GeneratePixFromConsumerUseCase } from '../../../useCases/consumer/GeneratePixFromConsumerUseCase'
import { prisma } from '../../../prisma'

export class PixController {
  async store(request: Request, response: Response) {
    const { id: consumerId } = request['tokenPayload']

    const value = request.body.value as number

    const pix = await GeneratePixFromConsumerUseCase.create(consumerId, value)

    if (!pix) {
      return response.status(400).json({
        message: 'Não foi possível gerar o PIX. Por favor tente mais tarde.',
      })
    }

    await prisma.deposit.create({
      data: {
        consumerId,
        value,
        pixTransactionId: pix.id,
      },
    })

    return response.status(201).json(pix)
  }
}
