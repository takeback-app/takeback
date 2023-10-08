import { Request, Response } from 'express'
import { prisma } from '../../prisma'

interface UpdateRequestDTO {
  depositFeePercentage: string
  depositMaxDailyValue: string
  bankPixFeePercentage: string
}

export class TransferConfigController {
  async index(_request: Request, response: Response) {
    const { depositFeePercentage, depositMaxDailyValue, bankPixFeePercentage } =
      await prisma.setting.findFirst()

    return response.json({
      depositFeePercentage: (+depositFeePercentage * 100).toFixed(2),
      depositMaxDailyValue: +depositMaxDailyValue.toFixed(2),
      bankPixFeePercentage: (+bankPixFeePercentage * 100).toFixed(2),
    })
  }

  async update(request: Request, response: Response) {
    const {
      depositFeePercentage,
      depositMaxDailyValue,
      bankPixFeePercentage,
    }: UpdateRequestDTO = request.body

    const settings = await prisma.setting.findFirst()

    await prisma.setting.update({
      where: { id: settings.id },
      data: {
        depositFeePercentage: +depositFeePercentage / 100,
        depositMaxDailyValue: +depositMaxDailyValue,
        bankPixFeePercentage: +bankPixFeePercentage / 100,
      },
    })

    return response.json({
      message: 'Configuração de transferências atualizada com sucesso',
    })
  }
}
