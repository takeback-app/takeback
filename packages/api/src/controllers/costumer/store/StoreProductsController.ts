import { Request, Response } from 'express'
import { prisma } from '../../../prisma'

export class StoreProductsController {
  async ongoing(request: Request, response: Response) {
    const consumerId = request['tokenPayload'].id

    const consumerAddress = await prisma.consumerAddress.findFirst({
      where: { consumer: { id: consumerId } },
      select: { cityId: true },
    })

    const products = await prisma.storeProduct.findMany({
      where: {
        AND: [{ dateLimit: { gt: new Date() } }, { stock: { gt: 0 } }],
        company: { companyAddress: { cityId: consumerAddress.cityId } },
      },
      orderBy: { dateLimit: 'asc' },
      include: {
        company: { select: { fantasyName: true } },
      },
    })

    return response.json(products)
  }

  async finished(request: Request, response: Response) {
    const consumerId = request['tokenPayload'].id

    const consumerAddress = await prisma.consumerAddress.findFirst({
      where: { consumer: { id: consumerId } },
      select: { cityId: true },
    })

    const products = await prisma.storeProduct.findMany({
      where: {
        OR: [{ dateLimit: { lt: new Date() } }, { stock: { lte: 0 } }],
        company: { companyAddress: { cityId: consumerAddress.cityId } },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        company: { select: { fantasyName: true } },
      },
    })

    return response.json(products)
  }

  async show(request: Request, response: Response) {
    const consumerId = request['tokenPayload'].id

    const { id } = request.params

    const boughtQuantity = await prisma.storeOrder.aggregate({
      where: { storeProductId: id, consumerId },
      _sum: { quantity: true },
    })

    const product = await prisma.storeProduct.findUnique({
      where: { id },
      include: {
        storeOrders: { where: { consumerId } },
        company: {
          select: {
            fantasyName: true,
            companyAddress: { select: { city: { select: { name: true } } } },
          },
        },
      },
    })

    return response.json({
      ...product,
      alreadyBoughtQuantity: boughtQuantity._sum.quantity,
    })
  }
}
