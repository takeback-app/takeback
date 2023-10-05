import { Request, Response } from 'express'
import { FindConsumersDataUseCase } from './FindConsumersDataUseCase'
import { ListCitiesUseCase } from './ListCitiesUseCase'
import { FindConsumersUseCase } from './FindConsumersUseCase'
import { UpdateStatusConsumerUseCase } from './UpdateStatusConsumerUseCase'
import { ForgotCostumerPasswordUseCase } from './ForgotConsumerPasswortUseCase'
import { FindDepositsUseCase } from './FindDepositsUseCase'
import { FindDepositsRequest } from '../../../requests/reports/manager/consumers/FindDepositsRequest'
import { InternalError } from '../../../config/GenerateErros'

class ConsumersController {
  async findConsumers(request: Request, response: Response) {
    const filters = request.query

    const find = new FindConsumersUseCase()

    const result = await find.execute({ filters })

    return response.status(200).json(result)
  }

  async findOneConsumer(request: Request, response: Response) {
    const consumerId = request.params.id

    const find = new FindConsumersDataUseCase()

    const consumerData = await find.execute({
      consumerId,
    })

    return response.status(200).json({ consumerData })
  }

  async listCities(request: Request, response: Response) {
    const list = new ListCitiesUseCase()

    const result = await list.execute()

    return response.status(200).json(result)
  }

  async updateConsumerStatus(request: Request, response: Response) {
    const consumerId = request.params.id
    const { deactivedAccount } = request.body

    const update = new UpdateStatusConsumerUseCase()
    const find = new FindConsumersDataUseCase()

    const message = await update.execute({
      consumerId,
      deactivedAccount,
    })

    const consumerData = await find.execute({
      consumerId,
    })

    return response.status(200).json({ message, consumerData })
  }

  async forgotCostumerPassword(request: Request, response: Response) {
    const { id } = request.params

    const { email } = request.body

    const forgot = new ForgotCostumerPasswordUseCase()

    const message = await forgot.execute({ id, email })

    return response.status(200).json({ message })
  }

  async findDeposits(request: Request, response: Response) {
    const form = FindDepositsRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const { dateEnd, dateStart, order, orderByColumn, page, isPaid } = form.data

    const find = new FindDepositsUseCase()

    const result = await find.execute({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      page: Number(page),
      isPaid: isPaid ? isPaid === 'true' : undefined,
    })

    return response.status(200).json(result)
  }
}

export { ConsumersController }
