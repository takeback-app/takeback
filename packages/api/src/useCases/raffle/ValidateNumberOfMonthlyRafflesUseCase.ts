import { DateTime } from 'luxon'
import { InternalError } from '../../config/GenerateErros'
import { prisma } from '../../prisma'
import { RaffleStatusEnum } from '../../enum/RaffleStatusEnum'

export class ValidateNumberOfMonthlyRafflesUseCase {
  public async execute(companyId: string) {
    const { numberMaxOfMonthlyRaffles, numberOfRaffleThisMonth } =
      await this.getCount(companyId)

    if (numberOfRaffleThisMonth >= numberMaxOfMonthlyRaffles) {
      throw new InternalError('Limite mensal de sorteios atingidos.', 400)
    }
  }

  public async getCount(companyId: string) {
    const dateState = DateTime.now().startOf('month').toJSDate()
    const dateEnd = DateTime.now().endOf('month').toJSDate()

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        paymentPlan: {
          select: {
            numberOfMonthlyRaffles: true,
          },
        },
        _count: {
          select: {
            raffles: {
              where: {
                createdAt: { gte: dateState, lte: dateEnd },
                status: {
                  description: {
                    in: [
                      RaffleStatusEnum.APPROVED,
                      RaffleStatusEnum.DELIVERING,
                      RaffleStatusEnum.FINISHED,
                      RaffleStatusEnum.PENDING_FINISHED,
                    ],
                  },
                },
              },
            },
          },
        },
      },
    })

    return {
      numberOfRaffleThisMonth: company._count.raffles,
      numberMaxOfMonthlyRaffles: company.paymentPlan.numberOfMonthlyRaffles,
    }
  }
}
