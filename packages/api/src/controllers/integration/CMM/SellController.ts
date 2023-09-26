import { Request, Response } from 'express'
import { Decimal } from '@prisma/client/runtime'
import { TransactionSource } from '@prisma/client'
import { CMMSellRequest } from '../../../requests/CMMSellRequest'
import { prisma } from '../../../prisma'
import { GenerateCashbackUseCase } from '../../../useCases/cashback/GenerateCashbackUseCase'
import { PlaceholderConsumer } from '../../../useCases/consumer/CreatePlaceholderConsumer'

class SellController {
  async handle(request: Request, response: Response) {
    const data = request.body

    const { cnpj, consumerCpf, companyUserCpf, ...cashbackData } =
      CMMSellRequest.getDataFormatted(data)

    const company = await prisma.company.findFirst({
      where: {
        registeredNumber: cnpj,
        useCMM: true,
      },
      select: { id: true },
    })

    if (!company) {
      return response.status(400).json({ message: 'Empresa não encontrada' })
    }

    const paymentMethods = []

    let totalAmount = new Decimal(0.0)

    for (const payment of cashbackData.paymentMethods) {
      totalAmount = totalAmount.plus(payment.value)

      const companyPaymentMethod = await prisma.companyPaymentMethod.findFirst({
        select: { id: true },
        where: { companyId: company.id, tPag: payment.tPag },
      })

      if (!companyPaymentMethod) {
        return response.status(400).json({
          message: `Forma de pagamento (${payment.tPag}) não encontrada na empresa (${cnpj})`,
        })
      }

      paymentMethods.push({ id: companyPaymentMethod.id, value: payment.value })
    }

    if (!totalAmount.equals(cashbackData.totalAmount)) {
      return response.status(400).json({
        message:
          'Valor total da compra não bate com os valores unitários para cada forma de pagamento',
      })
    }

    let consumer = await prisma.consumer.findFirst({
      where: {
        cpf: consumerCpf,
      },
    })

    if (consumer?.deactivatedAccount) {
      return response.status(400).json({ message: 'Cliente desativado' })
    }

    if (!consumer) {
      consumer = await PlaceholderConsumer.create(consumerCpf)
    }

    const companyUser = await prisma.companyUser.findFirst({
      where: {
        cpf: companyUserCpf,
      },
    })

    const useCase = new GenerateCashbackUseCase()

    const transaction = await useCase.execute({
      companyId: company.id,
      consumerId: consumer.id,
      companyUserId: companyUser?.id,
      ...cashbackData,
      paymentMethods,
      transactionSource: TransactionSource.CHECKOUT,
    })

    if (!transaction) {
      return response.status(400).json({ message: 'Erro ao criar transação' })
    }

    await prisma.cmmSells.create({
      data: {
        sell: data,
        transactionId: transaction.id,
      },
    })

    return response
      .status(200)
      .json({ message: 'Venda cadastrada com sucesso' })
  }
}

export default new SellController()
