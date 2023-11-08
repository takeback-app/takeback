import { Response, Request } from 'express'
import { CostumerFilterCompany } from './CostumerFilterCompany'
import { CostumerFindAppDataUseCase } from './CostumerFindAppDataUseCase'
import { CostumerFindCompaniesUseCase } from './CostumerFindCompaniesUseCase'
import { CostumerRegisterSignatureUseCase } from './CostumerRegisterSignatureUseCase'
import { CostumerUpdateAddressUseCase } from './CostumerUpdateAddressUseCase'
import { CostumerUpdateDataUseCase } from './CostumerUpdateDataUseCase'
import { CostumerUpdateEmailUseCase } from './CostumerUpdateEmailUseCase'
import { CostumerUpdatePhoneUseCase } from './CostumerUpdatePhoneUseCase'
import { CostumerUpdateSignatureUseCase } from './CostumerUpdateSignatureUseCase'
import { ForgotSignatureUseCase } from './ForgotSignatureUseCase'
import { ResetSignatureUseCase } from './ResetSignatureUseCase'
import { ConsumerAppVersionUseCase } from './UpdateAppVersionUseCase'
import { prisma } from '../../../prisma'

class CostumerDataController {
  async updateData(request: Request, response: Response) {
    const consumerID = request['tokenPayload'].id

    const { fullName } = request.body

    const update = new CostumerUpdateDataUseCase()

    const result = await update.execute({
      fullName,
      consumerID,
    })

    return response.status(200).json(result)
  }

  async updatePhone(request: Request, response: Response) {
    const consumerID = request['tokenPayload'].id

    const { phone } = request.body

    const update = new CostumerUpdatePhoneUseCase()

    const result = await update.execute({
      phone,
      consumerID,
    })

    return response.status(200).json(result)
  }

  async updateEmail(request: Request, response: Response) {
    const consumerID = request['tokenPayload'].id

    const { email } = request.body

    const update = new CostumerUpdateEmailUseCase()

    const result = await update.execute({
      consumerID,
      email,
    })

    return response.status(200).json(result)
  }

  async updateAddress(request: Request, response: Response) {
    const consumerID = request['tokenPayload'].id

    const { complement, district, number, street, zipCode } = request.body

    const update = new CostumerUpdateAddressUseCase()

    const result = await update.execute({
      complement,
      consumerID,
      district,
      number,
      street,
      zipCode,
    })

    return response.status(200).json(result)
  }

  async registerSignature(request: Request, response: Response) {
    const consumerID = request['tokenPayload'].id

    const { newSignature } = request.body

    const register = new CostumerRegisterSignatureUseCase()

    const result = await register.execute({
      consumerID,
      newSignature,
    })

    return response.status(200).json(result)
  }

  async updateSignature(request: Request, response: Response) {
    const consumerID = request['tokenPayload'].id

    const { newSignature, signature } = request.body

    const update = new CostumerUpdateSignatureUseCase()

    const result = await update.execute({
      consumerID,
      newSignature,
      signature,
    })

    return response.status(200).json(result)
  }

  async forgotSignature(request: Request, response: Response) {
    const { cpf } = request.body

    const forgot = new ForgotSignatureUseCase()

    const message = await forgot.execute({ cpf })

    return response.status(200).json({ message })
  }

  async resetSignature(request: Request, response: Response) {
    const { token, newSignature } = request.body

    const reset = new ResetSignatureUseCase()

    const message = await reset.execute({ newSignature, token })

    return response.status(200).json({ message })
  }

  async findAppData(request: Request, response: Response) {
    const consumerID = request['tokenPayload'].id

    const find = new CostumerFindAppDataUseCase()

    const result = await find.execute({ consumerID })

    return response.status(200).json(result)
  }

  async findCompanies(request: Request, response: Response) {
    const { offset, limit } = request.params
    const filters = request.query

    const find = new CostumerFindCompaniesUseCase()

    const result = await find.execute({
      limit,
      offset,
      filters,
    })

    return response.status(200).json(result)
  }

  async findOneCompany(request: Request, response: Response) {
    const companyId = request.params.id

    const company = await prisma.company.findFirst({
      where: { id: companyId },
      include: {
        companyUsers: {
          select: { id: true, name: true },
          where: { isActive: true, companyUserType: { isManager: false } },
        },
        companyPaymentMethods: {
          where: {
            isActive: true,
            paymentMethod: {
              isTakebackMethod: false,
              description: {
                not: 'Sorteio',
              },
            },
          },
          include: { paymentMethod: true },
        },
        companyAddress: true,
      },
    })

    return response.status(200).json(company)
  }

  async filterCompanies(request: Request, response: Response) {
    const { cityId } = request.query

    const filter = new CostumerFilterCompany()

    const result = await filter.execute({
      cityId: JSON.stringify(cityId),
    })

    return response.status(200).json(result)
  }

  async updateAppVersion(request: Request, response: Response) {
    const consumerID = request['tokenPayload'].id
    const { appVersion } = request.body

    const useCase = new ConsumerAppVersionUseCase()

    const res = await useCase.updateAppVersion({ appVersion, consumerID })

    return response.status(204).json(res)
  }

  async getAppVersion(request: Request, response: Response) {
    const consumerID = request['tokenPayload'].id

    const useCase = new ConsumerAppVersionUseCase()

    const res = await useCase.getAppVersion(consumerID)

    return response.status(200).json(res)
  }
}

export { CostumerDataController }
