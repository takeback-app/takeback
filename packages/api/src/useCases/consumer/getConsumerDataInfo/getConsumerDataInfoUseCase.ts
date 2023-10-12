import { prisma } from '../../../prisma'

export class GetConsumerDataInfoUseCase {
  async execute(consumerId: string) {
    const consumerData = await prisma.consumer.findUnique({
      where: {
        id: consumerId,
      },
      include: {
        consumerAddress: {
          include: {
            city: true,
          },
        },
      },
    })

    const transactions = await prisma.transaction.aggregate({
      where: {
        consumersId: consumerId,
        transactionStatus: {
          blocked: false,
        },
      },
      _sum: {
        cashbackAmount: true,
      },
    })

    return {
      consumerData,
      totalSaved: parseFloat(String(transactions._sum.cashbackAmount)),
    }
  }
}
