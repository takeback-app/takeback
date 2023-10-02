import { prisma } from '../../prisma'
import { PixEvent } from '../../@types/efipay'

export class PixEventUseCase {
  public static async handle(pixEvent: PixEvent) {
    const pixTransaction = await prisma.pixTransaction.findFirst({
      where: { txId: pixEvent.txid },
    })

    if (!pixTransaction) {
      return null
    }

    await prisma.pixTransaction.update({
      where: { id: pixTransaction.id },
      data: { status: 'PAID' },
    })

    const deposit = await prisma.deposit.findFirst({
      where: { pixTransactionId: pixTransaction.id },
      include: { consumer: { select: { balance: true } } },
    })

    if (!deposit) {
      return null
    }

    await prisma.consumer.update({
      where: { id: deposit.consumerId },
      data: { balance: deposit.consumer.balance.plus(deposit.value) },
    })

    await prisma.deposit.update({
      where: { id: deposit.id },
      data: { isPaid: true },
    })
  }
}
