import { Request, Response } from 'express'
import { Express } from '@sentry/node/types/tracing/integrations'
import { ApproveOrderAndReleaseCashbacksUseCase } from './useCases/ApproveOrderAndReleaseCashbacksUseCase'
import { FindPaymentOrdersUseCase } from './useCases/FindPaymentOrdersUseCase'
import { FindFilterOptionsToPaymentOrderUseCase } from './useCases/FindFilterOptionsToPaymentOrderUseCase'
import { SendTicketToEmailUseCase } from './useCases/SendTicketToEmailUseCase'
import { UpdatePaymentOrderStatusUseCase } from './useCases/UpdatePaymentOrderStatusUseCase'
import { FindTransactionsInPaymentOrderUseCase } from './useCases/FindTransactionsInPaymentOrderUseCase'
import { SendPixToEmailUseCase } from './useCases/SendPixToEmailUseCase'
import { FindPaymentOrderDetailsUseCase } from './useCases/FindPaymentOrderDetailsUseCase'
import { FindPaymentOrderRequest } from './requests/FindPaymentOrderRequest'
import { CancelPaymentOrderUseCase } from '../../commons/paymentOrder/CancelPaymentOrderUseCase'
import { InternalError } from '../../../config/GenerateErros'

interface FileS3 extends Express.Multer.File {
  location?: string
  bucket?: string
  key?: string
}

class PaymentOrderController {
  async findOrders(request: Request, response: Response) {
    const form = FindPaymentOrderRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const find = new FindPaymentOrdersUseCase()

    const result = await find.execute(form.data)

    return response.status(200).json(result)
  }

  async findOrderDetails(request: Request, response: Response) {
    const { orderId } = request.params

    const find = new FindPaymentOrderDetailsUseCase()
    const findTransactions = new FindTransactionsInPaymentOrderUseCase()

    const details = await find.execute({ orderId })
    const transactions = await findTransactions.execute({ orderId })

    return response.status(200).json({ details, transactions })
  }

  async findFilterOptions(request: Request, response: Response) {
    const find = new FindFilterOptionsToPaymentOrderUseCase()

    const filters = await find.execute()

    return response.status(200).json(filters)
  }

  async findTransactionsInPaymentOrder(request: Request, response: Response) {
    const paymentOrderId = request.params.id

    const find = new FindTransactionsInPaymentOrderUseCase()

    const transactions = await find.execute({ orderId: paymentOrderId })

    return response.status(200).json(transactions)
  }

  async approveOrderAndReleaseCashbacks(request: Request, response: Response) {
    const orderId = request.params.id

    const approve = new ApproveOrderAndReleaseCashbacksUseCase()

    const message = await approve.execute({
      paymentOrderId: parseInt(orderId),
    })

    return response.status(200).json({ message })
  }

  async sendPaymentInfoToEmail(request: Request, response: Response) {
    const paymentOrderId = request.params.id

    const sendTicket = new SendTicketToEmailUseCase()
    const sendPix = new SendPixToEmailUseCase()

    let fileData: FileS3

    if (request.file) {
      fileData = request.file

      const message = await sendTicket.execute({
        paymentOrderId: parseInt(paymentOrderId),
        fileName: fileData.key || fileData.filename,
        filePath: fileData.location || fileData.path,
        fileOriginalName: fileData.originalname,
        useCustomEmail: request.body.useCustomEmail,
        customEmail: request.body.customEmail,
      })

      return response.status(200).json({ message })
    } else {
      const message = await sendPix.execute({
        paymentOrderId: parseInt(paymentOrderId),
        pixKey: request.body.pixKey,
        useCustomEmail: request.body.useCustomEmail,
        customEmail: request.body.customEmail,
      })

      return response.status(200).json({ message })
    }
  }

  async updatePaymentOrderStatus(request: Request, response: Response) {
    const orderId = request.params.id

    const update = new UpdatePaymentOrderStatusUseCase()

    const message = update.execute({ orderId: parseInt(orderId) })

    return response.status(200).json(message)
  }

  async cancelOrder(request: Request, response: Response) {
    const orderId = request.params.id

    const cancelOrder = new CancelPaymentOrderUseCase()

    const result = await cancelOrder.execute({
      orderId: parseInt(orderId),
    })

    return response.status(200).json(result)
  }
}

export { PaymentOrderController }
