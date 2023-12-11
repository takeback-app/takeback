import { getRepository } from 'typeorm'
import { PaymentOrderMethods } from '../../../../database/models/PaymentOrderMethods'
import { PaymentOrderStatus } from '../../../../database/models/PaymentOrderStatus'

class FindFilterOptionsToPaymentOrderUseCase {
  async execute() {
    const status = await getRepository(PaymentOrderStatus).find()
    const methods = await getRepository(PaymentOrderMethods).find()

    return { status, methods }
  }
}

export { FindFilterOptionsToPaymentOrderUseCase }
