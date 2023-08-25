import { Request, Response } from 'express'
import { GetCompanyExtractUseCase } from '../../../useCases/extract/company/GetCompanyExtractUseCase'

export class ExtractController {
  async index(request: Request, response: Response) {
    const { id: companyId } = request['tokenPayload']

    const useCase = new GetCompanyExtractUseCase(companyId)

    const data = await useCase.execute()

    return response.json(data)
  }

  async paginated(request: Request, response: Response) {
    const { page } = request.query

    const { id: companyId } = request['tokenPayload']

    const pageNumber = Number(page) || 1

    const useCase = new GetCompanyExtractUseCase(companyId, pageNumber)

    const data = await useCase.execute()
    const monthName = useCase.getMonthName()

    return response.json({
      title: monthName,
      data,
    })
  }
}
