import { Request, Response } from 'express'
import { GetCompanyBalanceUseCase } from '../../../useCases/manager/companyTransferBalance/GetCompanyBalanceUseCase'
import { CompanyTransferBalanceUseCase } from '../../../useCases/manager/companyTransferBalance/CompanyTransferBalanceUseCase'
import { GetTransfersUseCase } from '../../../useCases/manager/companyTransferBalance/GetTransfersUseCase'
import { ListCompaniesUseCase } from '../../../useCases/manager/companyTransferBalance/ListCompaniesUseCase'

export class CompanyTransferBalanceController {
  async handleTransfer(request: Request, response: Response) {
    const { companySentId, companyReceivedId, value } = request.body

    const useCase = new CompanyTransferBalanceUseCase()

    const result = await useCase.execute({
      companySentId,
      companyReceivedId,
      value,
    })

    return response.status(200).json(result)
  }

  async getBalance(request: Request, response: Response) {
    const companyId = request.params.id
    const useCase = new GetCompanyBalanceUseCase()

    const company = await useCase.execute(companyId)

    return response.status(200).json(company)
  }

  async getTransfers(request: Request, response: Response) {
    const pageQuery = request.query.page

    const page = Number(pageQuery) || 1

    const useCase = new GetTransfersUseCase()

    const transfers = await useCase.execute(page)

    return response.status(200).json(transfers)
  }

  async listCompanies(request: Request, response: Response) {
    const useCase = new ListCompaniesUseCase()

    const companies = await useCase.execute()

    return response.status(200).json(companies)
  }
}
