import { Request, Response } from 'express'
import { FindaPaymentMethodUseCase } from './FindPaymentMethodUseCase'
import { FindPaymentOrderUseCase } from './FindPaymentOrderUseCase'
import { FindTransactionsInPaymentOrderUseCase } from './FindTransactionsInPaymentOrderUseCase'
import { GeneratePaymentOrderUseCase } from './GeneratePaymentOrderUseCase'
import { partition } from '../../../utils'
import { CancelPaymentOrderUseCase } from '../../commons/paymentOrder/CancelPaymentOrderUseCase'

interface Props {
  transactionIDs: number[]
  paymentMethodId: number
}

interface FindOrdersQueryProps {
  statusId?: string
}

class PaymentOrderController {
  async generate(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']
    const { transactionIDs: ids, paymentMethodId }: Props = request.body
    const [transactionIDs, monthlyPayment] = partition(
      ids,
      (t) => typeof t === 'number',
    )

    const useCase = new GeneratePaymentOrderUseCase()

    const result = await useCase.execute({
      companyId,
      transactionIDs,
      paymentMethodId,
      monthlyPayment,
    })

    return response.status(200).json(result)
  }

  async cancel(request: Request, response: Response) {
    const orderId = request.params.id

    const cancelOrder = new CancelPaymentOrderUseCase()

    const result = await cancelOrder.execute({
      orderId: parseInt(orderId),
    })

    return response.status(200).json(result)
  }

  async findPaymentMethod(request: Request, response: Response) {
    const find = new FindaPaymentMethodUseCase()

    const result = await find.execute()

    return response.status(200).json(result)
  }

  async findOrders(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']
    const { offset, limit } = request.params
    const filters: FindOrdersQueryProps = request.query

    const findUseCase = new FindPaymentOrderUseCase()

    const orders = await findUseCase.execute({
      companyId,
      pagination: { limit, offset },
      filters,
    })

    response.status(200).json(orders)
  }

  async findTransactionsInPaymentOrder(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']
    const paymentOrderId = request.params.id

    const find = new FindTransactionsInPaymentOrderUseCase()

    const transactions = await find.execute({
      companyId,
      paymentOrderId: parseInt(paymentOrderId),
    })

    return response.status(200).json(transactions)
  }
}

export { PaymentOrderController }
