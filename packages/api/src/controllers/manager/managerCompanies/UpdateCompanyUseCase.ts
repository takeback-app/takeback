import { getRepository } from 'typeorm'
import { IntegrationType } from '@prisma/client'
import { InternalError } from '../../../config/GenerateErros'
import { City } from '../../../database/models/City'
import { Companies } from '../../../database/models/Company'
import { CompaniesAddress } from '../../../database/models/CompanyAddress'
import { Industries } from '../../../database/models/Industry'

interface UpdateProps {
  fantasyName: string
  registeredNumber: string
  corporateName: string
  phone: string
  email: string
  industryId: string
  id: string
  companyId: string
  cityId: string
  street: string
  number: string
  district: string
  longitude?: string
  latitude?: string
  contactPhone: string
  useQRCode?: boolean
  integrationType: IntegrationType
}

class UpdateCompanyUseCase {
  async execute(props: UpdateProps) {
    if (!props.email || !props.corporateName || !props.fantasyName) {
      throw new InternalError('Dados incompletos', 400)
    }

    const company = await getRepository(Companies).findOne({
      where: { id: props.companyId },
      relations: ['address'],
    })

    if (!company) {
      throw new InternalError('Empresa não encontrada', 400)
    }

    const city = await getRepository(City).findOne({
      where: { id: props.cityId },
    })

    if (!city) {
      throw new InternalError('Cidade não encontrada', 400)
    }

    const industry = await getRepository(Industries).findOne(props.industryId)

    if (!industry) {
      throw new InternalError('Ramo de Atividade inexistente', 401)
    }

    const updateCompanyAddress = await getRepository(CompaniesAddress).update(
      company.address.id,
      {
        city,
        district: props.district,
        number: props.number,
        street: props.street,
        longitude: props.longitude,
        latitude: props.latitude,
      },
    )

    if (updateCompanyAddress.affected === 0) {
      throw new InternalError('Erro ao atualizar endereço da empresa', 500)
    }

    const updateCompany = await getRepository(Companies).update(
      props.companyId,
      {
        email: props.email,
        industry,
        registeredNumber: props.registeredNumber.replace(/[^\d]/g, ''),
        fantasyName: props.fantasyName,
        corporateName: props.corporateName,
        phone: props.phone.replace(/[^\d]/g, ''),
        contactPhone: props.contactPhone.replace(/[^\d]/g, ''),
        useQRCode: props.useQRCode,
        integrationType: props.integrationType,
      },
    )

    if (updateCompany.affected === 0) {
      throw new InternalError('Erro ao atualizar dados da empresa', 500)
    }

    return 'Empresa atualizada'
  }
}

export { UpdateCompanyUseCase }
