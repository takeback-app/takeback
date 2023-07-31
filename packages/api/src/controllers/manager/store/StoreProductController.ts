import { Request, Response } from 'express'
import { DateTime } from 'luxon'
import { prisma } from '../../../prisma'
import { CreateProductRequest } from '../../../requests/CreateProductRequest'
import { InternalError } from '../../../config/GenerateErros'

const PER_PAGE = 25

export class StoreProductController {
  async index(request: Request, response: Response) {
    const pageQuery = request.query.page

    const page = Number(pageQuery) || 1

    const products = await prisma.storeProduct.findMany({
      include: { company: { select: { fantasyName: true } } },
      orderBy: { createdAt: 'desc' },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    })

    const count = await prisma.storeProduct.count()

    return response.json({
      data: products,
      meta: { lastPage: Math.ceil(count / PER_PAGE) },
    })
  }

  async store(request: Request, response: Response) {
    const form = CreateProductRequest.safeParse(request.body)

    if (!form.success) {
      return response.status(422).json({ message: 'Erro no formulário' })
    }

    form.data.dateLimit = DateTime.fromISO(form.data.dateLimit)
      .endOf('day')
      .plus({ hours: 3 })
      .toISO()

    form.data.dateLimitWithdrawal = DateTime.fromISO(
      form.data.dateLimitWithdrawal,
    )
      .endOf('day')
      .plus({ hours: 3 })
      .toISO()

    await prisma.storeProduct.create({
      data: form.data as any,
    })

    return response
      .status(201)
      .json({ message: 'Produto cadastrado com sucesso' })
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params

    const countOrder = await prisma.storeOrder.count({
      where: { storeProductId: id },
    })

    if (countOrder) {
      throw new InternalError('Existem pedidos para esse produto', 400)
    }

    await prisma.storeProduct.delete({ where: { id } })

    return response.status(204)
  }
}
