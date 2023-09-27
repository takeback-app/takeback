import { Request, Response } from 'express'
import { Decimal } from '@prisma/client/runtime'
import { TransactionSource } from '@prisma/client'
import { DateTime } from 'luxon'
import { CMMSellRequest } from '../../../requests/CMMSellRequest'
import { prisma } from '../../../prisma'
import { GenerateCashbackUseCase } from '../../../useCases/cashback/GenerateCashbackUseCase'
import { PlaceholderConsumer } from '../../../useCases/consumer/CreatePlaceholderConsumer'

class SellController {
  async handle(request: Request, response: Response) {
    const data = request.body

    const { cnpj, consumerCpf, companyUserCpf, ...cashbackData } =
      CMMSellRequest.getDataFormatted(data)

    // TODO: mudar lógica de validação useCMM

    const company = await prisma.company.findFirst({
      where: {
        registeredNumber: cnpj,
        useCMM: true,
        paymentPlan: {
          canUseIntegration: true,
        },
      },
      select: { id: true, useCashbackAsBack: true },
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

    const backAmount =
      cashbackData.hasBackAmount && company.useCashbackAsBack
        ? totalAmount.toNumber() - cashbackData.totalAmount
        : 0

    const notBackAmountAndNotTotalAmountsEquals =
      !totalAmount.equals(cashbackData.totalAmount) &&
      !cashbackData.hasBackAmount

    if (notBackAmountAndNotTotalAmountsEquals || backAmount < 0) {
      return response.status(400).json({
        message:
          'Valor total da compra não bate com os valores unitários para cada forma de pagamento',
      })
    }

    cashbackData.backAmount = backAmount

    delete cashbackData.hasBackAmount

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

    let transaction = await prisma.transaction.findFirst({
      where: {
        companiesId: company.id,
        consumersId: consumer.id,
        totalAmount,
        createdAt: {
          gte: DateTime.fromJSDate(cashbackData.createdAt)
            .minus({ hour: 2 })
            .toJSDate(),
          lte: DateTime.fromJSDate(cashbackData.createdAt)
            .plus({ hour: 2 })
            .toJSDate(),
        },
      },
    })

    if (!transaction) {
      transaction = await useCase.execute({
        companyId: company.id,
        consumerId: consumer.id,
        companyUserId: companyUser?.id,
        ...cashbackData,
        paymentMethods,
        transactionSource: TransactionSource.CHECKOUT,
      })
    }

    await prisma.cmmSells.create({
      data: {
        sell: data,
        sellId: cashbackData.sellId,
        transactionId: transaction.id,
      },
    })

    return response
      .status(200)
      .json({ message: 'Venda cadastrada com sucesso' })
  }
}

export default new SellController()
