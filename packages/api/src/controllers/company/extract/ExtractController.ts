import { Request, Response } from 'express'
import { DateTime } from 'luxon'
import { GetCompanyExtractUseCase } from '../../../useCases/extract/company/GetCompanyExtractUseCase'

export class ExtractController {
  async index(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const useCase = new GetCompanyExtractUseCase(companyId)

    const data = await useCase.execute()

    return response.json(data)
  }

  async paginated(request: Request, response: Response) {
    const { month, year } = request.query

    const { companyId } = request['tokenPayload']

    const parsedDate = DateTime.fromObject({
      year: Number(year),
      month: Number(month) + 1,
      day: 1,
    })

    const useCase = new GetCompanyExtractUseCase(companyId, parsedDate)

    const data = await useCase.execute()

    const totalizer = await useCase.getTotalizer()

    const monthName = parsedDate.setLocale('pt-br').toFormat('MMMM - yyyy')
    const parsedMonthName = monthName[0].toUpperCase() + monthName.slice(1)

    return response.json({
      title: parsedMonthName,
      data,
      totalizer,
    })
  }

  async filterPeriod(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const useCase = new GetCompanyExtractUseCase(companyId)

    const filter = await useCase.getFilterPeriod()

    return response.json(filter)
  }
}
