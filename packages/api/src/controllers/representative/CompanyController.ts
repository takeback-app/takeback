import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'

import { prisma } from '../../prisma'

import { CreateCompanyUseCase } from '../../useCases/representative/CreateCompanyUserCase'

import { RegisterCompanyDefaultPaymentMethodsUseCase } from '../manager/managerCompanies/RegisterCompanyDefaultPaymentMethodsUseCase'
import { AllowCompanyFirstAccessUseCase } from '../manager/managerCompanies/AllowCompanyFirstAccessUseCase'
import { ForgotPasswordToRootUserUseCase } from '../manager/managerCompanies/ForgotPasswordToRootUserUseCase'
import { FindCompanyUsersUseCase } from '../manager/managerCompanies/FindCompanyUsersUseCase'
import { UpdateCompanyUseCase } from '../manager/managerCompanies/UpdateCompanyUseCase'
import { GetRepresentative } from '../../useCases/representative/GetRepresentativeUseCase'
import { maskCNPJ, maskPhone } from '../../utils/Masks'

const PER_PAGE = 25

export class CompanyController {
  async index(request: Request, response: Response) {
    const { id } = request['tokenPayload']

    const pageQuery = request.query.page
    const { company, industryId, statusId, cityId, monthlyPayment } =
      request.query as Record<string, string>

    const page = Number(pageQuery) || 1

    const { whereCondominiumFilter } = await GetRepresentative.handle(id)

    const where: Prisma.CompanyWhereInput = {
      ...whereCondominiumFilter,
      AND: {
        OR: [
          {
            fantasyName: { contains: company },
          },
          {
            corporateName: { contains: company },
          },
          {
            registeredNumber: { contains: company },
          },
        ],
        industryId: industryId ? Number(industryId) : undefined,
        statusId: statusId ? Number(statusId) : undefined,
        companyAddress: {
          cityId: cityId ? Number(cityId) : undefined,
        },
        currentMonthlyPaymentPaid: monthlyPayment
          ? monthlyPayment === 'true'
          : undefined,
      },
    }

    const companies = await prisma.company.findMany({
      where,
      include: {
        industry: { select: { description: true } },
        companyStatus: { select: { description: true } },
      },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    })

    const count = await prisma.company.count({ where })

    return response.json({
      data: companies,
      meta: { lastPage: Math.ceil(count / PER_PAGE) },
    })
  }

  async rootUser(request: Request, response: Response) {
    const { id } = request.params

    const user = await prisma.companyUser.findFirstOrThrow({
      where: { companyId: id, isRootUser: true },
    })

    return response.json({
      email: user.email,
      name: user.name,
      isDifferentEmail: false,
      isDifferentName: false,
    })
  }

  async show(request: Request, response: Response) {
    const { id } = request.params

    const company = await prisma.company.findUnique({
      where: { id },
      select: {
        id: true,
        fantasyName: true,
        corporateName: true,
        registeredNumber: true,
        email: true,
        phone: true,
        statusId: true,
        industryId: true,
        contactPhone: true,
        companyAddress: true,
        companyStatus: { select: { description: true } },
        paymentPlan: { select: { description: true, value: true } },
      },
    })

    const consultant = await prisma.representativeUserCompany.findFirst({
      where: { companyId: id },
    })

    company.registeredNumber = maskCNPJ(company.registeredNumber)
    company.phone = maskPhone(company.phone)
    company.contactPhone = maskPhone(company.contactPhone)

    return response.json({
      ...company,
      consultantId: consultant?.representativeUserId ?? '',
    })
  }

  async store(request: Request, response: Response) {
    const { representativeId } = request['tokenPayload']

    const {
      industryId,
      corporateName,
      email,
      fantasyName,
      phone,
      registeredNumber,
      zipCode,
      consultantId,
      paymentPlanId,
      companyUserData,
    } = request.body

    const useCase = new CreateCompanyUseCase()

    const company = await useCase.handle({
      industryId: Number(industryId),
      corporateName,
      email,
      fantasyName,
      phone,
      registeredNumber,
      zipCode,
      paymentPlanId,
      representativeId,
    })

    if (consultantId) {
      await prisma.representativeUserCompany.create({
        data: { companyId: company.id, representativeUserId: consultantId },
      })
    }

    const registerDefaultMethods =
      new RegisterCompanyDefaultPaymentMethodsUseCase()
    const allowCompanyAccess = new AllowCompanyFirstAccessUseCase()

    await allowCompanyAccess.execute({
      companyId: company.id,
      ...companyUserData,
    })

    await registerDefaultMethods.execute(company.id)

    return response.status(201).json(company)
  }

  async update(request: Request, response: Response) {
    const props = request.body
    const { id } = request['tokenPayload']
    const companyId = request.params.id

    const { cityId, district, number, street } = props.companyAddress

    const update = new UpdateCompanyUseCase()

    const message = await update.execute({
      id,
      companyId,
      email: props.email,
      corporateName: props.corporateName,
      fantasyName: props.fantasyName,
      phone: props.phone,
      registeredNumber: props.registeredNumber,
      industryId: props.industryId,
      cityId: cityId,
      district: district,
      number: number,
      street: street,
      contactPhone: props.contactPhone,
      integrationType: props.integrationType,
    })

    return response.status(200).json({ message })
  }

  async updateConsultant(request: Request, response: Response) {
    const companyId = request.params.id
    const { consultantId } = request.body

    await prisma.representativeUserCompany.deleteMany({
      where: { companyId },
    })

    if (consultantId) {
      await prisma.representativeUserCompany.create({
        data: { companyId, representativeUserId: consultantId },
      })
    }

    return response.status(200).json({ message: 'Consultor atualizado' })
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
}
