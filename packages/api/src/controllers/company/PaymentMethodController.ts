import { Request, Response } from 'express'
import { prisma } from '../../prisma'

export class PaymentMethodController {
  async index(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const data = await prisma.paymentMethod.findMany({
      select: { id: true, description: true },
      where: { companyPaymentMethods: { some: { companyId } } },
    })

    return response.json(data)
  }

  async all(_request: Request, response: Response) {
    const data = await prisma.paymentMethod.findMany({
      select: { id: true, description: true },
      where: { isTakebackMethod: false },
    })

    return response.json(data)
  }
}
