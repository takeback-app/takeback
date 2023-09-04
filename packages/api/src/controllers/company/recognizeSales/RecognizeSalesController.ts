import { Request, Response } from 'express'

import { FindUnrecognizedSalesUseCase } from './FindUnrecognizedSalesUseCase'
import { RecognizeSalesUseCase } from './RecognizeSalesUseCase'
import { partition } from '../../../utils'

interface Props {
  transactionIDs: number[]
}

class RecognizeSalesController {
  async findUnrecognizedSales(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']
    const { dateStart, dateEnd, order, orderByColumn } =
      request.query as Record<string, string>

    const findCashbacks = new FindUnrecognizedSalesUseCase()

    const transactions = await findCashbacks.execute({
      companyId,
      dateStart,
      dateEnd,
      order: order === 'asc' ? 'asc' : 'desc',
      orderByColumn: orderByColumn === 'fullName' ? 'fullName' : 'createdAt',
    })

    return response.status(200).json(transactions)
  }

  async recognizeSales(request: Request, response: Response) {
    const { userId } = request['tokenPayload']
    const { transactionIDs: ids }: Props = request.body

    const [transactionIDs] = partition(ids, (t) => typeof t === 'number')
    const recognizeSales = new RecognizeSalesUseCase()

    const message = await recognizeSales.execute({
      transactionIDs,
      userId,
    })

    return response.status(200).json(message)
  }
}

export { RecognizeSalesController }
