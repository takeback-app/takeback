import { Request, Response } from 'express'
import { SolicitationUseCase } from '../../useCases/cashback/CreateSolicitationUseCase'
import { CreateCashbackSolicitationRequest } from '../../requests/CreateCashbackSolicitationRequest'
import { InternalError } from '../../config/GenerateErros'
import AutomaticApproveSolicitationChecker from '../../useCases/integration/AutomaticApproveSolicitationChecker'

export class SolicitationController {
  async cashback(request: Request, response: Response) {
    const { id: consumerId } = request['tokenPayload']

    const form = CreateCashbackSolicitationRequest.safeParse(request.body)

    if (!form.success) {
      throw new InternalError('Existem erros nos dados enviados.', 422)
    }

    const { companyId, companyPaymentMethodId, value } = form.data

    const useCase = new SolicitationUseCase()

    const solicitation = await useCase.createCashback({
      consumerId,
      companyId,
      companyPaymentMethodId,
      valueInCents: Math.round(value * 100),
    })

    await AutomaticApproveSolicitationChecker.handle(solicitation)

    return response.status(201).json()
  }

  async payment(request: Request, response: Response) {
    const { id: consumerId } = request['tokenPayload']

    const form = CreateCashbackSolicitationRequest.safeParse(request.body)

    if (!form.success) {
      throw new InternalError('Existem erros nos dados enviados.', 422)
    }

    const { companyId, companyPaymentMethodId, value } = form.data

    const useCase = new SolicitationUseCase()

    const solicitation = await useCase.createPayment({
      consumerId,
      companyId,
      companyPaymentMethodId,
      valueInCents: Math.round(value * 100),
    })

    await AutomaticApproveSolicitationChecker.handle(solicitation)

    return response.status(201).json()
  }
}
