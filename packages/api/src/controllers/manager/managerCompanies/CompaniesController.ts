import { Request, Response } from 'express'
import { AllowCompanyFirstAccessUseCase } from './AllowCompanyFirstAccessUseCase'
import { RegisterCompanyDefaultPaymentMethodsUseCase } from './RegisterCompanyDefaultPaymentMethodsUseCase'
import { UpdateCompanyUseCase } from './UpdateCompanyUseCase'
import { FindCompaniesUseCase } from './FindCompaniesUseCase'
import { FindOneCompanyUseCase } from './FindOneCompanyUseCase'
import { FindCompanyUsersUseCase } from './FindCompanyUsersUseCase'
import { UpdateCustomFeeUseCase } from './UpdateCustomFeeUseCase'
import { UpdateCompanyMontlyPlanUseCase } from './UpdateCompanyMontlyPlanUseCase'
import { ForgotPasswordToRootUserUseCase } from './ForgotPasswordToRootUserUseCase'
import { UpdateManyCompanyStatusUseCase } from './UpdateManyCompanyStatusUseCase'
import { RelationWithRepresentativeUseCase } from './RelationWithRepresentativeUseCase'
import { FindUseCase } from '../managerRepresentatives/FindUseCase'
import { prisma } from '../../../prisma'
import { InternalError } from '../../../config/GenerateErros'

class CompaniesController {
  async allowFirstAccess(request: Request, response: Response) {
    const data = request.body

    const findUseCase = new FindOneCompanyUseCase()
    const findUser = new FindCompanyUsersUseCase()
    const registerDefaultMethods =
      new RegisterCompanyDefaultPaymentMethodsUseCase()
    const allowCompanyAccess = new AllowCompanyFirstAccessUseCase()

    const message = await allowCompanyAccess.execute(data)
    await registerDefaultMethods.execute(data.companyId)
    const companyData = await findUseCase.execute({
      companyId: data.companyId,
    })
    const companyUsers = await findUser.execute({ companyId: data.companyId })

    return response.status(200).json({ message, companyData, companyUsers })
  }

  async findCompanies(request: Request, response: Response) {
    const filters = request.query

    const findUseCase = new FindCompaniesUseCase()

    const companies = await findUseCase.execute({ filters })

    return response.status(200).json(companies)
  }

  async findOneCompany(request: Request, response: Response) {
    const companyId = request.params.id

    const findUseCase = new FindOneCompanyUseCase()
    const findUser = new FindCompanyUsersUseCase()
    const findRepresentative = new FindUseCase()

    const company = await findUseCase.execute({
      companyId,
    })

    const users = await findUser.execute({
      companyId,
    })

    const representatives = await findRepresentative.execute()

    return response.status(200).json({ company, users, representatives })
  }

  async updateCompany(request: Request, response: Response) {
    const props = request.body
    const { id } = request['tokenPayload']
    const companyId = request.params.id

    const update = new UpdateCompanyUseCase()
    const find = new FindOneCompanyUseCase()

    const message = await update.execute({
      id,
      companyId,
      email: props.email,
      corporateName: props.corporateName,
      fantasyName: props.fantasyName,
      phone: props.phone,
      registeredNumber: props.registeredNumber,
      industryId: props.industryId,
      cityId: props.cityId,
      district: props.district,
      number: props.number,
      street: props.street,
      contactPhone: props.contactPhone,
    })

    const companies = await find.execute({ companyId })

    return response.status(200).json({ message, companies })
  }

  async updateCustomFee(request: Request, response: Response) {
    const { customIndustryFee, customIndustryFeeActive } = request.body
    const companyId = request.params.id

    const update = new UpdateCustomFeeUseCase()
    const findUseCase = new FindOneCompanyUseCase()

    const message = await update.execute({
      companyId,
      customIndustryFee,
      customIndustryFeeActive,
    })

    const companyData = await findUseCase.execute({ companyId })

    return response.status(200).json({ message, companyData })
  }

  async updatePaymentPlan(request: Request, response: Response) {
    const { planId } = request.body
    const companyId = request.params.id

    const update = new UpdateCompanyMontlyPlanUseCase()
    const findUseCase = new FindOneCompanyUseCase()

    const message = await update.execute({ companyId, planId })
    const companyData = await findUseCase.execute({ companyId })

    return response.status(200).json({ message, companyData })
  }

  async forgotPasswordToRootUser(request: Request, response: Response) {
    const companyId = request.params.id
    const { userName, email } = request.body

    const forgot = new ForgotPasswordToRootUserUseCase()
    const findUser = new FindCompanyUsersUseCase()

    const message = await forgot.execute({ companyId, email, userName })
    const users = await findUser.execute({ companyId })

    return response.status(200).json({ message, users })
  }

  async updateManyCompanyStatus(request: Request, response: Response) {
    const { statusId, companyIds } = request.body

    const update = new UpdateManyCompanyStatusUseCase()

    const message = await update.execute({ companyIds, statusId })

    return response.status(200).json({ message })
  }

  async relationWithRepresentative(request: Request, response: Response) {
    const { representativeId } = request.body
    const companyId = request.params.id

    await prisma.company.update({
      where: { id: companyId },
      data: { representativeId: representativeId || null },
    })

    if (!representativeId) {
      await prisma.representativeUserCompany.deleteMany({
        where: { companyId },
      })
    }

    return response.json({ message: 'Representante alterado' })
  }

  async updateCompanyLogo(request: Request, response: Response) {
    const { id } = request.params
    const { logoUrl } = request.body

    await prisma.company.update({
      where: { id },
      data: { logoUrl },
    })

    return response.json({ message: 'Logo alterado' })
  }

  async getIntegration(request: Request, response: Response) {
    const { id } = request.params

    const integration = await prisma.integrationSettings.findFirst({
      where: { companyId: id },
    })

    if (!integration) {
      const company = await prisma.company.findFirstOrThrow({
        where: { id },
        select: { paymentPlan: { select: { canUseIntegration: true } } },
      })

      if (!company.paymentPlan.canUseIntegration) {
        throw new InternalError(
          'O plano de pagamento dessa empresa não permite integração NFC-e',
          403,
        )
      }

      return response.json({ url: `${process.env.API_URL}/integration/nfc-e` })
    }

    return response.json(integration)
  }

  async updateIntegration(request: Request, response: Response) {
    const { id } = request.params

    const url = request.body.url

    const folderPath = request.body.folderPath || null

    await prisma.integrationSettings.upsert({
      where: { companyId: id },
      update: { url, folderPath },
      create: { url, folderPath, companyId: id },
    })

    return response.json({ message: 'Integração atualizada com sucesso' })
  }
}

export { CompaniesController }
