import { Request, Response } from 'express'
import { prisma } from '../../../prisma'
import { InternalError } from '../../../config/GenerateErros'
import { ValidateUserPasswordUseCase } from '../companyCashback/ValidateUserPasswordUseCase'

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

  async getStoreOrder(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const { id } = request.params

    const order = await prisma.storeOrder.findFirst({
      select: {
        id: true,
        quantity: true,
        validationCode: true,
        createdAt: true,
        withdrawalAt: true,
        consumer: {
          select: {
            fullName: true,
            cpf: true,
          },
        },
        product: {
          select: {
            name: true,
            sellPrice: true,
            buyPrice: true,
            dateLimitWithdrawal: true,
          },
        },
        companyUser: {
          select: {
            name: true,
          },
        },
      },
      where: {
        validationCode: id,
        product: {
          companyId: companyId,
        },
      },
    })

    if (!order) {
      throw new InternalError('Produto não encontrado', 400)
    }

    return response.json({
      ...order,
      wasWithdrawn: !!order.withdrawalAt,
    })
  }

  async update(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const { id } = request.params

    const { validationCode, companyUserPassword } = request.body

    const validateUserPassword = new ValidateUserPasswordUseCase()

    const companyUser = await validateUserPassword.findCompanyUserByPassword(
      companyId,
      companyUserPassword,
    )

    if (!companyUser) {
      throw new InternalError('Senha inválida', 400)
    }

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

    if (order.validationCode !== validationCode) {
      throw new InternalError('Codigo de retirada incorreto', 400)
    }

    await prisma.storeOrder.update({
      where: { id },
      data: {
        withdrawalAt: new Date(),
        companyUserId: companyUser.id,
      },
    })

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    })

    await prisma.company.update({
      where: { id: companyId },
      data: {
        positiveBalance: company.positiveBalance.add(order.companyCreditValue),
      },
    })

    return response.json({ message: 'Retirada concluída com sucesso!' })
  }
}
