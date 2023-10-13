import { Request, Response } from 'express'
import { ApproveOrderAndReleaseCashbacksUseCase } from './ApproveOrderAndReleaseCashbacksUseCase'
import { FindPaymentOrdersUseCase } from './FindPaymentOrdersUseCase'
import { FindFilterOptionsToPaymentOrderUseCase } from './FindFilterOptionsToPaymentOrderUseCase'
import { SendTicketToEmailUseCase } from './SendTicketToEmailUseCase'
import { UpdatePaymentOrderStatusUseCase } from './UpdatePaymentOrderStatusUseCase'
import { FindTransactionsInPaymentOrderUseCase } from './FindTransactionsInPaymentOrderUseCase'
import { SendPixToEmailUseCase } from './SendPixToEmailUseCase'
import { FindPaymentOrderDetailsUseCase } from './FindPaymentOrderDetailsUseCase'
import { CancelPaymentOrderUseCase } from '../../commons/paymentOrder/CancelPaymentOrderUseCase'

interface FileS3 extends Express.Multer.File {
  location?: string
  bucket?: string
  key?: string
}

class PaymentOrderController {
  async findOrders(request: Request, response: Response) {
    const filters = request.query

    const find = new FindPaymentOrdersUseCase()

    const result = await find.execute({ filters })

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
