import { getRepository } from 'typeorm'
import { Companies } from '../../../../database/models/Company'
import { PaymentOrder } from '../../../../database/models/PaymentOrder'
import { PaymentOrderMethods } from '../../../../database/models/PaymentOrderMethods'
import { PaymentOrderStatus } from '../../../../database/models/PaymentOrderStatus'

interface Props {
  orderId?: string
}

class FindPaymentOrderDetailsUseCase {
  async execute({ orderId }: Props) {
    const order = await getRepository(PaymentOrder)
      .createQueryBuilder('paymentOrder')
      .select([
        'paymentOrder.id',
        'paymentOrder.value',
        'paymentOrder.approvedAt',
        'paymentOrder.createdAt',
        'paymentMethod.description',
        'paymentStatus.description',
        'company.fantasyName',
      ])
      .where('paymentOrder.id = :orderId', { orderId })
      .leftJoin(
        PaymentOrderMethods,
        'paymentMethod',
        'paymentMethod.id = paymentOrder.paymentMethod',
      )
      .leftJoin(
        PaymentOrderStatus,
        'paymentStatus',
        'paymentStatus.id = paymentOrder.status',
      )
      .leftJoin(Companies, 'company', 'company.id = paymentOrder.company')
      .getRawOne()

    return order
  }
}

export { FindPaymentOrderDetailsUseCase }
