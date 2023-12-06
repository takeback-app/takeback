import { MaritalStatus, Schooling, Sex } from '@prisma/client'
import axios from 'axios'
import bcrypt from 'bcrypt'
import { DateTime } from 'luxon'
import { InternalError } from '../../../config/GenerateErros'
import { prisma } from '../../../prisma'
import { apiCorreiosResponseType } from '../../../types/ApiCorreiosResponse'
import { GenerateNewUserBonus } from '../../../useCases/consumer/bonus/GenerateNewUserBonus'
import { CPFValidate } from '../../../utils/CPFValidate'

interface userDataProps {
  fullName: string
  cpf: string
  email: string
  zipCode: string
  password: string
  sex: string
  birthDate: string
  phone?: string
  maritalStatus: string
  schooling: string
  hasChildren: string
  monthlyIncomeId: string
}

class RegisterCostumerUseCase {
  async execute({
    fullName,
    cpf,
    email,
    zipCode,
    birthDate,
    sex,
    password,
    phone,
    ...rest
  }: userDataProps) {
    if (!fullName || !cpf || !zipCode || !email || !password) {
      throw new InternalError('Dados incompletos', 400)
    }

    if (!CPFValidate(cpf.replace(/\D/g, ''))) {
      throw new InternalError('CPF inválido', 400)
    }

    const client = await prisma.consumer.findFirst({
      where: { cpf },
      include: {
        consumerAddress: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!!client && !client.isPlaceholderConsumer) {
      throw new InternalError('CPF já cadastrado', 302)
    }

    const newAddress = await this.updateAddress(
      client.consumerAddress.id,
      zipCode,
    )

    const passwordEncrypted = bcrypt.hashSync(password, 10)

    const { hasChildren, maritalStatus, monthlyIncomeId, schooling } = rest

    const consumerData = {
      fullName,
      cpf,
      phone: phone ? phone.replace(/\D/g, '') : '',
      email,
      sex: sex as Sex,
      birthDate: birthDate
        ? DateTime.fromFormat(birthDate, 'dd/MM/yyyy')
            .plus({ hours: 3 })
            .toJSDate()
        : undefined,
      addressId: newAddress.id,
      password: passwordEncrypted,
      isPlaceholderConsumer: false,
      hasChildren: hasChildren === 'sim',
      monthlyIncomeId: monthlyIncomeId ? Number(monthlyIncomeId) : undefined,
      schooling: schooling as Schooling,
      maritalStatus: maritalStatus as MaritalStatus,
      activatedAt: DateTime.now().toJSDate(),
    }

    const newClient = await prisma.consumer.upsert({
      where: { cpf },
      update: consumerData,
      create: consumerData,
    })

    if (client) {
      const newUserBonus = new GenerateNewUserBonus()

      const transaction = await prisma.transaction.findFirst({
        where: { consumersId: client.id },
        select: { id: true },
        orderBy: { createdAt: 'asc' },
      })

      await newUserBonus.create(transaction.id)
    }

    return newClient
  }

  async updateAddress(consumerAddressId?: number, zipCodeString?: string) {
    if (!zipCodeString) {
      return null
    }

    const {
      data: { bairro, localidade, logradouro, uf, ibge, complemento },
    }: apiCorreiosResponseType = await axios.get(
      `https://viacep.com.br/ws/${zipCodeString}/json/`,
    )

    if (!uf) {
      throw new InternalError('Cep não localizado', 404)
    }

    const city = await prisma.city.findFirst({
      where: {
        ibgeCode: ibge,
      },
    })

    const state = await prisma.state.findFirst({
      where: {
        initials: uf,
      },
    })

    const newCity =
      city ||
      (await prisma.city.create({
        data: {
          ibgeCode: ibge,
          name: localidade,
          stateId: state.id,
        },
      }))

    const zipCode = await prisma.zipCode.findFirst({
      where: {
        zipCode: zipCodeString,
      },
    })

    const newZipCode =
      zipCode ||
      (await prisma.zipCode.create({
        data: { zipCode: zipCodeString, citiesId: newCity.id },
      }))

    const addressData = {
      cityId: newCity.id,
      street: logradouro,
      district: bairro,
      complement: complemento,
      zipCode: newZipCode.zipCode,
    }

    const address = await prisma.consumerAddress.upsert({
      where: { id: consumerAddressId },
      update: addressData,
      create: addressData,
    })

    return address
  }
}

export { RegisterCostumerUseCase }
