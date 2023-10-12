import { prisma } from '../../../prisma'

export class GetConsumerDataInfoUseCase {
  async execute(consumerId: string) {
    const consumerData = await prisma.consumer.findUnique({
      where: {
        id: consumerId,
      },
      select: {
        id: true,
        fullName: true,
        sex: true,
        phone: true,
        email: true,
        cpf: true,
        birthDate: true,
        balance: true,
        blockedBalance: true,
        emailConfirmated: true,
        signatureRegistered: true,
        phoneConfirmated: true,
        codeToConfirmEmail: true,
        deactivatedAccount: true,
        createdAt: true,
        updatedAt: true,
        consumerAddress: {
          select: {
            id: true,
            street: true,
            district: true,
            number: true,
            complement: true,
            zipCode: true,
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

    const parsedConsumerData = {
      ...consumerData,
      balance: Number(consumerData.balance),
      blockedBalance: Number(consumerData.blockedBalance),
      address: consumerData.consumerAddress,
    }
    delete parsedConsumerData.consumerAddress

    return {
      consumerData: parsedConsumerData,
      totalSaved: parseFloat(String(transactions._sum.cashbackAmount)),
    }
  }
}
