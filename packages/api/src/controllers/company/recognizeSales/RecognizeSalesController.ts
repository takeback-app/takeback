import { Request, Response } from 'express'

import { FindUnrecognizedSalesUseCase } from './FindUnrecognizedSalesUseCase'
import { RecognizeSalesUseCase } from './RecognizeSalesUseCase'
import { RecognizeSalesRequest } from '../../../requests/RecognizeSalesRequest'
import { InternalError } from '../../../config/GenerateErros'

interface Props {
  transactionIDs: number[]
}

class RecognizeSalesController {
  async findUnrecognizedSales(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const form = RecognizeSalesRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const { dateStart, dateEnd, order, orderByColumn } = form.data

    const findCashbacks = new FindUnrecognizedSalesUseCase()

    const transactions = await findCashbacks.execute({
      companyId,
      dateStart,
      dateEnd,
      order,
      orderByColumn,
    })

    return response.status(200).json(transactions)
  }

  async recognizeSales(request: Request, response: Response) {
    const { userId } = request['tokenPayload']
    const { transactionIDs }: Props = request.body

    const recognizeSales = new RecognizeSalesUseCase()

    const message = await recognizeSales.execute({
      transactionIDs,
      userId,
    })

    return response.status(200).json(message)
  }
}

export { RecognizeSalesController }
