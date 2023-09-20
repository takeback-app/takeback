import { Request, Response } from 'express'
import { Decimal } from '@prisma/client/runtime'
import { CMMSellRequest } from '../../../requests/CMMSellRequest'
import { prisma } from '../../../prisma'
import { GenerateCashbackUseCase } from '../../../useCases/cashback/GenerateCashbackUseCase'

class SellController {
  async handle(request: Request, response: Response) {
    const data = request.body

    const { cnpj, consumerCpf, ...cashbackData } =
      CMMSellRequest.getDataFormatted(data)

    const company = await prisma.company.findFirst({
      where: {
        registeredNumber: cnpj,
        // TODO: verificar se existe integração com CMM
      },
      select: { id: true },
    })

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

    if (!company) {
      return response.status(400).json({ message: 'Empresa não encontrada' })
    }

    const consumer = await prisma.consumer.findFirst({
      where: {
        cpf: consumerCpf,
        isPlaceholderConsumer: false, // TODO: verificar se pode ser ou não
        deactivatedAccount: false,
      },
    })

    if (!consumer) {
      return response.status(400).json({ message: 'Cliente não encontrado' })
    }

    const useCase = new GenerateCashbackUseCase()

    await useCase.execute({
      companyId: company.id,
      consumerId: consumer.id,
      ...cashbackData,
      paymentMethods,
    })

    return response
      .status(200)
      .json({ message: 'Venda cadastrada com sucesso' })
  }
}

export default new SellController()
