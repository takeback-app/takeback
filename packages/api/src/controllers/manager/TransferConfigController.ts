import { Request, Response } from 'express'
import { prisma } from '../../prisma'

export class TransferConfigController {
  async index(_request: Request, response: Response) {
    const { depositFeePercentage, depositMaxDailyValue } =
      await prisma.setting.findFirst()

    return response.json({
      percentage: (+depositFeePercentage * 100).toFixed(0),
      maxDailyValue: depositMaxDailyValue,
    })
  }

  async update(request: Request, response: Response) {
    const { percentage, maxDailyValue } = request.body

    const settings = await prisma.setting.findFirst()

    await prisma.setting.update({
      where: { id: settings.id },
      data: {
        depositFeePercentage: +percentage / 100,
        depositMaxDailyValue: +maxDailyValue,
      },
    })

    return response.json({
      message: 'Configuração de transferências atualizada com sucesso',
    })
  }
}
