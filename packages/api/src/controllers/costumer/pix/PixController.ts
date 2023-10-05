import { Request, Response } from 'express'
import { DateTime } from 'luxon'
import { GeneratePixFromConsumerUseCase } from '../../../useCases/consumer/GeneratePixFromConsumerUseCase'
import { prisma } from '../../../prisma'

export class PixController {
  async store(request: Request, response: Response) {
    const { id: consumerId } = request['tokenPayload']

    const today = DateTime.now().minus({ hour: 3 }).startOf('day').toJSDate()
    const dailyDeposits = await prisma.deposit.aggregate({
      where: {
        consumerId,
        createdAt: {
          gte: today,
        },
      },
      _sum: {
        value: true,
      },
    })

    const { depositMaxDailyValue } = await prisma.setting.findFirst()

    const value = request.body.value as number

    const totalDailyDeposit = Number(dailyDeposits._sum.value) + Number(value)

    if (totalDailyDeposit >= Number(depositMaxDailyValue)) {
      return response.status(400).json({
        message:
          'Não foi possível gerar o PIX. Depósito máximo diário atingido.',
      })
    }

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
