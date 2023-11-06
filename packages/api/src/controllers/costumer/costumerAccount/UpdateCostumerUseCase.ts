import { MaritalStatus, Schooling, Sex } from '@prisma/client'
import axios from 'axios'
import { InternalError } from '../../../config/GenerateErros'
import { prisma } from '../../../prisma'
import { apiCorreiosResponseType } from '../../../types/ApiCorreiosResponse'

export interface ConsumerAddressData {
  street: string
  district: string
  number: string
  city?: string
  zipCode: string
  complement: string
}

interface UserDataProps {
  sex: Sex
  birthDate: Date
  hasChildren: boolean
  maritalStatus: MaritalStatus
  monthlyIncomeId?: number
  schooling: Schooling
  phone?: string
  fullName: string
  consumerAddress: ConsumerAddressData
  consumerId: string
}

export class UpdateCostumerUseCase {
  async execute({
    sex,
    birthDate,
    hasChildren,
    maritalStatus,
    monthlyIncomeId,
    schooling,
    phone,
    fullName,
    consumerAddress,
    consumerId,
  }: UserDataProps) {
    const consumer = await prisma.consumer.findUnique({
      where: { id: consumerId },
    })

    const {
      data: { bairro, localidade, logradouro, uf, ibge, complemento },
    }: apiCorreiosResponseType = await axios.get(
      `https://viacep.com.br/ws/${consumerAddress.zipCode}/json/`,
    )

    if (!uf) {
      throw new InternalError('Cep não localizado', 404)
    }

    const city = await prisma.city.findFirst({
      where: {
        ibgeCode: ibge,
      },
    })

    const newCity =
      city ||
      (await prisma.city.create({
        data: {
          ibgeCode: ibge,
          name: localidade,
        },
      }))

    const zipCode = await prisma.zipCode.findFirst({
      where: {
        zipCode: consumerAddress.zipCode,
      },
    })

    const newZipCode =
      zipCode ||
      (await prisma.zipCode.create({
        data: { zipCode: consumerAddress.zipCode, citiesId: newCity.id },
      }))

    const address = await prisma.consumerAddress.update({
      where: { id: consumer.addressId },
      data: {
        cityId: newCity.id,
        street: logradouro,
        district: bairro,
        complement: complemento,
        zipCode: newZipCode.zipCode,
      },
    })

    const updatedUser = await prisma.consumer.update({
      where: { id: consumer.id },
      data: {
        sex,
        birthDate,
        hasChildren,
        maritalStatus,
        monthlyIncomeId,
        schooling,
        phone,
        fullName,
        addressId: address.id,
      },
      include: {
        consumerAddress: {
          include: {
            city: true,
          },
        },
      },
    })

    return {
      name: updatedUser.fullName,
      cpf: updatedUser.cpf,
      sex: updatedUser.sex,
      phone: updatedUser.phone,
      birthday: updatedUser.birthDate,
      hasChildren: updatedUser.hasChildren ? 'sim' : 'não',
      maritalStatus: updatedUser.maritalStatus,
      monthlyIncomeId: String(updatedUser.monthlyIncomeId),
      schooling: updatedUser.schooling,
      address: {
        zipCode: updatedUser.consumerAddress.zipCode,
        city: updatedUser.consumerAddress.city.name,
      },
    }
  }
}
