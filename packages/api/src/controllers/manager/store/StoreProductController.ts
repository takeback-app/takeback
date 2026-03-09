import { Request, Response } from 'express'
import { DateTime } from 'luxon'
import { prisma } from '../../../prisma'
import { CreateProductRequest } from '../../../requests/CreateProductRequest'
import { UpdateProductRequest } from '../../../requests/UpdateProductRequest'
import { InternalError } from '../../../config/GenerateErros'
import { CompanyStatusEnum } from '../../../enum/CompanyStatusEnum'
import { NotifyNewStoreProductUseCase } from '../../../useCases/raffle/NotifyNewStoreProductUseCase'

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

  async show(request: Request, response: Response) {
    const { id } = request.params

    const product = await prisma.storeProduct.findUnique({
      where: { id },
      include: {
        company: { select: { fantasyName: true } },
        storeOrders: { include: { consumer: { select: { fullName: true } } } },
      },
    })

    return response.json(product)
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

    const storeProduct = await prisma.storeProduct.create({
      data: form.data as any,
    })

    new NotifyNewStoreProductUseCase().execute(storeProduct)

    return response
      .status(201)
      .json({ message: 'Produto cadastrado com sucesso' })
  }

  async update(request: Request, response: Response) {
    const { id } = request.params

    const product = await prisma.storeProduct.findUnique({ where: { id } })

    if (!product) {
      throw new InternalError('Produto não encontrado', 404)
    }

    const form = UpdateProductRequest.safeParse(request.body)

    if (!form.success) {
      return response.status(422).json({ message: 'Erro no formulário' })
    }

    const orderCount = await prisma.storeOrder.count({
      where: { storeProductId: id },
    })

    const hasOrders = orderCount > 0

    const updateData: any = {
      name: form.data.name,
      unit: form.data.unit,
      imageUrl: form.data.imageUrl,
      maxBuyPerConsumer: form.data.maxBuyPerConsumer,
      defaultPrice: form.data.defaultPrice,
      dateLimit: DateTime.fromISO(form.data.dateLimit)
        .endOf('day')
        .plus({ hours: 3 })
        .toISO(),
      dateLimitWithdrawal: DateTime.fromISO(form.data.dateLimitWithdrawal)
        .endOf('day')
        .plus({ hours: 3 })
        .toISO(),
    }

    if (form.data.stock !== undefined) {
      updateData.stock = form.data.stock
    }

    if (!hasOrders) {
      updateData.sellPrice = form.data.sellPrice
      updateData.buyPrice = form.data.buyPrice
      updateData.companyId = form.data.companyId
    }

    await prisma.storeProduct.update({ where: { id }, data: updateData })

    return response.json({ message: 'Oferta atualizada com sucesso' })
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

  async listCompanies(request: Request, response: Response) {
    const companies = await prisma.company.findMany({
      where: {
        companyStatus: { description: CompanyStatusEnum.ACTIVE },
        paymentPlan: { canHaveStoreProducts: true },
      },
    })

    return response.json(companies)
  }
}
