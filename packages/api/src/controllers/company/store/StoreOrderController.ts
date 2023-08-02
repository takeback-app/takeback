import { Request, Response } from 'express'
import { prisma } from '../../../prisma'
import { InternalError } from '../../../config/GenerateErros'

export class StoreOrderController {
  async index(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const orders = await prisma.storeOrder.findMany({
      where: { product: { companyId }, withdrawalAt: null },
      include: {
        product: { select: { name: true, buyPrice: true, unit: true } },
        consumer: { select: { fullName: true } },
      },
    })

    return response.json(orders)
  }

  async update(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const { id } = request.params

    const { code } = request.body

    const order = await prisma.storeOrder.findFirst({
      where: { id, product: { companyId } },
      include: {
        product: { select: { buyPrice: true } },
      },
    })

    if (!order) {
      throw new InternalError('Pedido não encontrado', 404)
    }

    if (order.withdrawalAt) {
      throw new InternalError('Pedido já retirado', 403)
    }

    if (order.validationCode !== code) {
      throw new InternalError('Codigo de retirada incorreto', 400)
    }

    await prisma.storeOrder.update({
      where: { id },
      data: {
        withdrawalAt: new Date(),
      },
    })

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    })

    const credit = order.product.buyPrice.times(order.quantity)

    await prisma.company.update({
      where: { id: companyId },
      data: {
        positiveBalance: company.positiveBalance.add(credit),
      },
    })

    return response.json({ message: 'Retirada concluída com sucesso!' })
  }
}
