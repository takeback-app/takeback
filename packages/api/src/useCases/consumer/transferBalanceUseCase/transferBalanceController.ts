import { Request, Response } from 'express'
import { TransferBalanceUseCase } from './transferBalanceUseCase'
import { GetConsumerDataInfoUseCase } from '../getConsumerDataInfo/getConsumerDataInfoUseCase'
import { UpdateBalanceExpireDate } from '../UpdateBalanceExpireDate'

export class TransferBalanceController {
  async handle(request: Request, response: Response) {
    const consumerId = request['tokenPayload'].id
    const { password, consumerReceivedId, value } = request.body

    const useCase = new TransferBalanceUseCase()

    await useCase.execute({
      consumerId,
      password,
      consumerReceivedId,
      value,
    })

    const getUserDataUseCase = new GetConsumerDataInfoUseCase()

    const data = await getUserDataUseCase.execute(consumerId)

    const updateBalanceExpireDate = new UpdateBalanceExpireDate()

    await updateBalanceExpireDate.execute(consumerId)

    return response.status(200).json(data)
  }
}
