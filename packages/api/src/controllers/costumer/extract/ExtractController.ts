import { Request, Response } from 'express'
import { DateTime } from 'luxon'
import { prisma } from '../../../prisma'
import {
  GetExtractUseCase,
  formatMonthTitle,
} from '../../../useCases/extract/GetExtractUseCase'

export class ExtractController {
  async index(request: Request, response: Response) {
    const { id: consumerId } = request['tokenPayload']

    const useCase = new GetExtractUseCase(consumerId)

    const data = await useCase.execute()

    return response.json(data)
  }

  async paginated(request: Request, response: Response) {
    const { page } = request.query

    const { id: consumerId } = request['tokenPayload']

    const pageNumber = Number(page) || 1

    const useCase = new GetExtractUseCase(consumerId)
    const items = await useCase.execute()

    const monthKeys: string[] = []
    const itemsByMonth = new Map<string, typeof items>()

    for (const item of items) {
      const monthKey = DateTime.fromJSDate(item.referenceDate).toFormat(
        'yyyy-MM',
      )
      const bucket = itemsByMonth.get(monthKey)

      if (bucket) {
        bucket.push(item)
      } else {
        itemsByMonth.set(monthKey, [item])
        monthKeys.push(monthKey)
      }
    }

    monthKeys.sort((a, b) => b.localeCompare(a))

    const monthKey = monthKeys[pageNumber - 1]

    if (!monthKey) return response.json({ title: undefined, data: [] })

    return response.json({
      title: formatMonthTitle(DateTime.fromFormat(monthKey, 'yyyy-MM')),
      data: itemsByMonth.get(monthKey),
    })
  }

  async showTransaction(request: Request, response: Response) {
    const { id } = request.params

    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(id) },
      include: {
        company: { select: { fantasyName: true } },
        transactionStatus: { select: { id: true, description: true } },
        transactionPaymentMethods: {
          select: {
            id: true,
            cashbackPercentage: true,
            cashbackValue: true,
            companyPaymentMethod: {
              select: { paymentMethod: { select: { description: true } } },
            },
          },
        },
      },
    })

    return response.json(transaction)
  }

  async showTransfer(request: Request, response: Response) {
    const { id: consumerId } = request['tokenPayload']
    const { id } = request.params

    const transfer = await prisma.transfer.findUnique({
      where: { id: Number(id) },
      select: {
        value: true,
        createdAt: true,
        consumerReceivedId: true,
        senderConsumer: { select: { fullName: true } },
        receiverConsumer: { select: { fullName: true } },
      },
    })

    return response.json({
      isReceived: transfer.consumerReceivedId === consumerId,
      consumerName:
        transfer.consumerReceivedId === consumerId
          ? transfer.senderConsumer.fullName
          : transfer.receiverConsumer.fullName,
      createdAt: transfer.createdAt,
      value: +transfer.value,
    })
  }
}
