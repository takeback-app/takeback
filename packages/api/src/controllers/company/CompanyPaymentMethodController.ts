import { Request, Response } from 'express'
import { prisma } from '../../prisma'
import { InternalError } from '../../config/GenerateErros'

export class CompanyPaymentMethodController {
  async index(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const TAKEBACK_PAYMENT_METHOD_ID = 1

    const companyPaymentMethods = await prisma.companyPaymentMethod.findMany({
      where: {
        companyId,
        paymentMethod: { id: { not: TAKEBACK_PAYMENT_METHOD_ID } },
      },
      include: { paymentMethod: { select: { description: true } } },
      orderBy: { id: 'asc' },
    })

    return response.json(companyPaymentMethods)
  }

  async store(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const paymentMethodId = Number(request.body.paymentMethodId)
    const cashbackPercentage = Number(request.body.cashbackPercentage)

    const alreadyExistPaymentMethod = await prisma.companyPaymentMethod.count({
      where: { companyId, paymentMethodId },
    })

    if (alreadyExistPaymentMethod) {
      throw new InternalError(
        'Já existe esse método de pagamento cadastrado para a empresa',
        403,
      )
    }

    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
    })

    if (paymentMethod.initialPercentage?.greaterThan(cashbackPercentage)) {
      throw new InternalError(
        `O percentual de cashback para ${
          paymentMethod.description
        } não pode ser menor que ${paymentMethod.initialPercentage.times(
          100,
        )}%`,
        403,
      )
    }

    await prisma.companyPaymentMethod.create({
      data: {
        companyId,
        paymentMethodId,
        cashbackPercentage,
        isActive: true,
        tPag: paymentMethod.tPag,
      },
    })

    return response
      .status(201)
      .json({ message: 'Método de pagamento cadastrado com sucesso' })
  }

  async update(request: Request, response: Response) {
    const id = Number(request.params.id)

    const cashbackPercentage = Number(request.body.cashbackPercentage)
    const isActive = request.body.isActive === 'active'

    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: { companyPaymentMethods: { some: { id } } },
    })

    if (paymentMethod.initialPercentage?.greaterThan(cashbackPercentage)) {
      throw new InternalError(
        `O percentual de cashback para ${
          paymentMethod.description
        } não pode ser menor que ${paymentMethod.initialPercentage.times(
          100,
        )}%`,
        403,
      )
    }

    if (!isActive && paymentMethod.initialPercentage) {
      throw new InternalError(
        'Não é possível desativar um método de pagamento padrão',
        403,
      )
    }

    await prisma.companyPaymentMethod.update({
      where: { id },
      data: {
        cashbackPercentage,
        isActive,
      },
    })

    return response.json({
      message: 'Método de pagamento atualizado com sucesso',
    })
  }

  async updateTPag(request: Request, response: Response) {
    const id = Number(request.params.id)

    const tPag = Number(request.body.tPag)

    await prisma.companyPaymentMethod.update({
      where: { id },
      data: { tPag },
    })

    return response.json({
      message: 'Método de pagamento atualizado com sucesso',
    })
  }

  async delete(request: Request, response: Response) {
    const id = Number(request.params.id)

    const transactionSolicitations = await prisma.transactionSolicitation.count(
      {
        where: { companyPaymentMethodId: id },
      },
    )

    if (transactionSolicitations) {
      throw new InternalError(
        'Não é possível deletar um método de pagamento que já foi utilizado em uma solicitação de transação',
        403,
      )
    }

    const transactionPaymentMethods =
      await prisma.transactionPaymentMethod.count({
        where: { paymentMethodId: id },
      })

    if (transactionPaymentMethods) {
      throw new InternalError(
        'Não é possível deletar um método de pagamento que já foi utilizado em uma transação',
        403,
      )
    }

    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: { companyPaymentMethods: { some: { id } } },
    })

    if (paymentMethod.initialPercentage) {
      throw new InternalError(
        'Não é possível deletar um método de pagamento padrão',
        403,
      )
    }

    return response.status(204)
  }
}
