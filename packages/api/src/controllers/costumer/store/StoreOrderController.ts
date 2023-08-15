import { Request, Response } from 'express'
import { prisma } from '../../../prisma'
import { InternalError } from '../../../config/GenerateErros'
import { generateCode } from '../../../utils/RandomValueGenerate'

export class StoreOrderController {
  async index(request: Request, response: Response) {
    const consumerId = request['tokenPayload'].id

    const orders = await prisma.storeOrder.findMany({
      where: { consumerId },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          include: {
            company: { select: { fantasyName: true } },
          },
        },
      },
    })

    return response.json(orders)
  }

  async show(request: Request, response: Response) {
    const consumerId = request['tokenPayload'].id

    const { id } = request.params

    const order = await prisma.storeOrder.findFirst({
      where: { id, consumerId },
      include: {
        product: {
          include: {
            company: { select: { fantasyName: true } },
          },
        },
      },
    })

    return response.json(order)
  }

  async withdrawal(request: Request, response: Response) {
    const consumerId = request['tokenPayload'].id

    const { id } = request.params

    const order = await prisma.storeOrder.findFirst({
      where: { id, consumerId },
      select: { withdrawalAt: true },
    })

    return response.json({ wasWithdrawal: !!order.withdrawalAt })
  }

  async store(request: Request, response: Response) {
    const consumerId = request['tokenPayload'].id

    const { productId, quantity } = request.body

    const product = await prisma.storeProduct.findUniqueOrThrow({
      where: { id: productId },
      select: {
        name: true,
        maxBuyPerConsumer: true,
        stock: true,
        dateLimit: true,
        sellPrice: true,
        buyPrice: true,
        company: { select: { fantasyName: true } },
      },
    })

    const boughtQuantity = await prisma.storeOrder.aggregate({
      where: { storeProductId: productId, consumerId },
      _sum: { quantity: true },
    })

    const totalQuantity = boughtQuantity._sum.quantity + quantity

    if (totalQuantity > product.maxBuyPerConsumer) {
      throw new InternalError(
        `Não é possível comprar mais do que ${product.maxBuyPerConsumer} itens por usuário.`,
        403,
      )
    }

    if (quantity > product.stock) {
      throw new InternalError(
        `Não é possível comprar mais do que o disponível em estoque.`,
        403,
      )
    }

    const dateLimitIsOnPast = product.dateLimit < new Date()

    if (dateLimitIsOnPast) {
      throw new InternalError(
        'Não é possível comprar um produto já expirado.',
        403,
      )
    }

    const consumer = await prisma.consumer.findUniqueOrThrow({
      where: { id: consumerId },
      select: { balance: true },
    })

    const orderValue = product.sellPrice.times(quantity)

    if (orderValue.greaterThan(consumer.balance)) {
      throw new InternalError(
        'Você não tem saldo suficiente para essa compra.',
        403,
      )
    }

    const order = await prisma.storeOrder.create({
      data: {
        consumerId,
        quantity,
        value: orderValue,
        storeProductId: productId,
        validationCode: String(generateCode()),
        companyCreditValue: product.buyPrice.times(quantity),
      },
    })

    await prisma.storeProduct.update({
      where: { id: productId },
      data: {
        stock: product.stock - quantity,
      },
    })

    await prisma.consumer.update({
      where: { id: consumerId },
      data: {
        balance: consumer.balance.minus(orderValue),
      },
    })

    return response.status(201).json({
      ...order,
      product,
    })
  }
}
