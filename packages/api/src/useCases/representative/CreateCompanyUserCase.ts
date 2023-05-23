import axios, { AxiosResponse } from "axios";
import { InternalError } from "../../config/GenerateErros";
import { prisma } from "../../prisma";
import { ApiCorreiosResponse } from "../../types/ApiCorreiosResponse";

interface CreateCompanyDTO {
  industryId: number;
  corporateName: string;
  email: string;
  fantasyName: string;
  phone: string;
  registeredNumber: string;
  zipCode: string;
  paymentPlanId: number;
  representativeId: string;
}

export class CreateCompanyUseCase {
  async handle(dto: CreateCompanyDTO) {
    const {
      corporateName,
      email,
      fantasyName,
      industryId,
      phone,
      registeredNumber,
      zipCode,
      paymentPlanId,
      representativeId,
    } = dto;

    const alreadyExists = await prisma.company.findFirst({
      where: { registeredNumber },
      select: { id: true },
    });

    if (alreadyExists) {
      throw new InternalError("CNPJ já cadastrado", 400);
    }

    const industry = await prisma.industry.findUnique({
      where: { id: industryId },
    });

    if (!industry) {
      throw new InternalError("Ramo de atividade não encontrado", 404);
    }

    const companyStatus = await prisma.companyStatus.findFirst({
      where: { description: "Cadastro solicitado" },
    });

    const paymentPlan = await prisma.paymentPlan.findFirst({
      where: { id: paymentPlanId },
    });

    if (!companyStatus || !paymentPlan) {
      throw new InternalError("Sistema não configurado", 400);
    }

    const {
      data: { bairro, localidade, logradouro, uf, ibge, complemento },
    } = await axios.get<unknown, AxiosResponse<ApiCorreiosResponse>>(
      `https://viacep.com.br/ws/${zipCode}/json/`
    );

    if (!uf) {
      throw new InternalError("Cep não localizado", 404);
    }

    const state = await prisma.state.findFirst({
      where: { initials: uf },
    });

    let city = await prisma.city.findFirst({
      where: { ibgeCode: ibge },
    });

    city = await prisma.city.upsert({
      where: { id: city.id },
      update: {},
      create: {
        name: localidade,
        ibgeCode: ibge,
        stateId: state.id,
      },
    });

    const companyAddress = await prisma.companyAddress.create({
      data: {
        cityId: city.id,
        street: logradouro,
        district: bairro,
        complement: complemento,
        zipCode,
      },
    });

    return await prisma.company.create({
      data: {
        corporateName,
        fantasyName,
        registeredNumber,
        email,
        phone,
        addressId: companyAddress.id,
        industryId: industry.id,
        statusId: companyStatus.id,
        paymentPlanId: paymentPlan.id,
        representativeId,
      },
    });
  }
}
