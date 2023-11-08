import { Request, Response } from 'express'
import { GetBalanceUseCase } from '../../../useCases/company/transfer/GetBalanceUseCase'
import { TransferBalanceUseCase } from '../../../useCases/company/transfer/TransferBalanceUseCase'
import { GetTransfersUseCase } from '../../../useCases/company/transfer/GetTransfersUseCase'
import { ListCompaniesUseCase } from '../../../useCases/company/transfer/ListCompaniesUseCase'

export class TransferController {
  async handleTransfer(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']
    const { companyReceivedId, value } = request.body

    const useCase = new TransferBalanceUseCase()

    const result = await useCase.execute({
      companySentId: companyId,
      companyReceivedId,
      value,
    })

    return response.status(200).json(result)
  }

  async getBalance(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']
    const useCase = new GetBalanceUseCase()

    const company = await useCase.execute(companyId)

    return response.status(200).json(company)
  }

  async getTransfers(request: Request, response: Response) {
    const pageQuery = request.query.page
    const { companyId } = request['tokenPayload']
    const page = Number(pageQuery) || 1

    const useCase = new GetTransfersUseCase()

    const transfers = await useCase.execute({ page, companyId })

    return response.status(200).json(transfers)
  }

  async listCompanies(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']
    const useCase = new ListCompaniesUseCase()

    const companies = await useCase.execute(companyId)

    return response.status(200).json(companies)
  }
}
