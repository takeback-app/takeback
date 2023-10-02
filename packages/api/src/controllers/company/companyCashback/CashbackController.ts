import { Request, Response } from 'express'

import { IntegrationType } from '@prisma/client'
import { GetConsumerInfoUseCase } from './GetConsumerInfoUseCase'
import { CancelCashBackUseCase } from './CancelCashBackUseCase'
import { FindPendingCashbacksUseCase } from './FindPendingCashbacksUseCase'
import { FindCashbackStatusUseCase } from './FindCashbackStatusUseCase'
import { FindAllCashbacksUseCase } from './FindAllCashbacksUseCase'
import { FindCashbackFiltersUseCase } from './FindCashbackFiltersUseCase'
import { ValidateUserPasswordUseCase } from './ValidateUserPasswordUseCase'
import { VerifyCashbacksExpired } from './VerifyCashbacksExpired'
import { GetConsumerAutocompleteUseCase } from './GetConsumerAutocompleteUseCase'
import { FindConsumersBirthdaysUseCase } from './FindConsumersBirthdaysUseCase'
import { prisma } from '../../../prisma'
import { CashRegisterUseCase } from '../../../useCases/cashback/CashRegisterUseCase'
import { partition } from '../../../utils'
import { ChargebackUseCase } from '../../../useCases/cashback/ChargebackUseCase'

interface CancelProps {
  transactionIDs: number[]
  cancellationDescription: string
}

class CashbackController {
  async validateUserPasswordToGenerateCashback(
    request: Request,
    response: Response,
  ) {
    const { companyId, userId } = request['tokenPayload']
    const { password } = request.body

    const verify = new ValidateUserPasswordUseCase()

    const result = await verify.execute({ companyId, password, userId })

    return response.status(200).json(result)
  }

  async getConsumerAutoComplete(request: Request, response: Response) {
    const cpf = request.params.cpf
    const { companyId } = request['tokenPayload']

    const consumers = new GetConsumerAutocompleteUseCase()

    const result = await consumers.execute({ cpf, companyId })

    return response.status(200).json(result)
  }

  async getConsumerInfo(request: Request, response: Response) {
    const cpf = request.params.cpf

    const consumerInfo = new GetConsumerInfoUseCase()

    const result = await consumerInfo.execute({ cpf })

    return response.status(200).json(result)
  }

  async findCashbackFilters(request: Request, response: Response) {
    const find = new FindCashbackFiltersUseCase()

    const status = await find.execute()

    return response.status(200).json(status)
  }

  async chargeback(request: Request, response: Response) {
    const { id } = request.params

    const useCase = new ChargebackUseCase()

    await useCase.handle(Number(id))

    return response.json({ message: 'Chargeback realizado com sucesso' })
  }

  async findPendingCashbacks(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const integrationCount = await prisma.integrationSettings.count({
      where: {
        companyId,
        company: {
          integrationType: IntegrationType.DESKTOP,
          paymentPlan: { canUseIntegration: true },
        },
      },
    })

    const findCashbacks = new FindPendingCashbacksUseCase()

    const cashbacks = await findCashbacks.execute({ companyId })

    return response
      .status(200)
      .json({ cashbacks, hasIntegration: !!integrationCount })
  }

  async findAllCashbacks(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']
    const filters = request.query

    const { page } = request.query

    const responseJson = await new FindAllCashbacksUseCase().execute({
      companyId,
      filters,
      page: Number(page || 1),
    })

    return response.status(200).json(responseJson)
  }

  async status(_request: Request, response: Response) {
    const status = await new FindCashbackStatusUseCase().execute()

    return response.status(200).json(status)
  }

  async cancelCashBack(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const { cancellationDescription, transactionIDs: ids }: CancelProps =
      request.body

    const [transactionIDs] = partition(ids, (t) => typeof t === 'number')

    const cancel = new CancelCashBackUseCase()

    const success = await cancel.execute({
      cancellationDescription,
      transactionIDs,
      companyId,
    })

    if (success) {
      const cashbacks = new FindPendingCashbacksUseCase()

      const result = await cashbacks.execute({ companyId })

      return response.status(200).json(result)
    }
  }

  async verifyCashbacksExpired(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const verify = new VerifyCashbacksExpired()

    const transactions = await verify.execute({ companyId })

    return response.status(200).json(transactions)
  }

  async listWaiting(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const waitingTransactionStatus = await prisma.transactionStatus.findFirst({
      where: { description: 'Aguardando' },
    })

    const transactions = await prisma.transaction.findMany({
      where: {
        companiesId: companyId,
        transactionStatusId: waitingTransactionStatus.id,
        keyTransaction: null,
      },
      include: {
        transactionPaymentMethods: {
          select: {
            companyPaymentMethod: {
              select: { paymentMethod: { select: { description: true } } },
            },
          },
        },
        transactionStatus: true,
        consumer: true,
      },
    })

    return response.json(transactions)
  }

  async generateCashback(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const cashback = new CashRegisterUseCase()

    await cashback.execute({
      companyId,
      ...request.body,
    })

    return response.status(200).json('Cashback emitido')
  }

  async findAllCompanyConsumersBirthdays(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const birthdays = new FindConsumersBirthdaysUseCase()

    const result = await birthdays.findAllCompanyConsumersBirthdays({
      companyId,
    })

    return response.status(200).json(result)
  }

  async findIfConsumerBirthday(request: Request, response: Response) {
    const cpf = request.params.cpf

    const birthdays = new FindConsumersBirthdaysUseCase()

    const result = await birthdays.findIfConsumerBirthday({ cpf })

    return response.status(200).json(result)
  }
}

export { CashbackController }
