import 'dotenv/config'
import { TransferBalanceUseCase } from '../useCases/consumer/transferBalanceUseCase/transferBalanceUseCase'
import { GetConsumerDataInfoUseCase } from '../useCases/consumer/getConsumerDataInfo/getConsumerDataInfoUseCase'
import { UpdateBalanceExpireDate } from '../useCases/consumer/UpdateBalanceExpireDate'

async function main() {
  try {
    const consumerId = '1faa2ca7-e873-4dac-893f-ac89d00274ff'
    const password = '126952'
    const consumerReceivedId = '8db31a32-645d-4abb-b10e-f4d0ea84fb10'
    const value = 2

    const useCase = new TransferBalanceUseCase()

    /* await useCase.execute({
      consumerId,
      password,
      consumerReceivedId,
      value,
    }) */

    await Promise.all([
      useCase.execute({
        consumerId,
        password,
        consumerReceivedId,
        value,
      }),
      useCase.execute({
        consumerId,
        password,
        consumerReceivedId,
        value,
      }),
    ])

    const getUserDataUseCase = new GetConsumerDataInfoUseCase()

    const data = await getUserDataUseCase.execute(consumerId)

    const updateBalanceExpireDate = new UpdateBalanceExpireDate()

    await updateBalanceExpireDate.execute(consumerId)

    return data
  } catch (error) {
    console.error('Ocorreu um erro:', error)
  }
}

main()
