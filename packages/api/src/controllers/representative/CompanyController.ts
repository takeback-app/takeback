import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

import { prisma } from "../../prisma";

import { CreateCompanyUseCase } from "../../useCases/representative/CreateCompanyUserCase";

import { FindOneCompanyUseCase } from "../manager/managerCompanies/FindOneCompanyUseCase";
import { RegisterCompanyTakebackPaymentMethodsUseCase } from "../manager/managerCompanies/RegisterCompanyTakebackPaymentMethodsUseCase";
import { AllowCompanyFirstAccessUseCase } from "../manager/managerCompanies/AllowCompanyFirstAccessUseCase";
import { ForgotPasswordToRootUserUseCase } from "../manager/managerCompanies/ForgotPasswordToRootUserUseCase";
import { FindCompanyUsersUseCase } from "../manager/managerCompanies/FindCompanyUsersUseCase";
import { UpdateCompanyUseCase } from "../manager/managerCompanies/UpdateCompanyUseCase";

export class CompanyController {
  async index(request: Request, response: Response) {
    const { id } = request["tokenPayload"];

    const user = await prisma.representativeUser.findUniqueOrThrow({
      where: { id },
    });

    const isAdmin = user.role === "ADMIN";

    const where: Prisma.CompanyWhereInput = isAdmin
      ? {
          representativeId: user.representativeId,
        }
      : {
          representativeUserCompanies: {
            some: { representativeUserId: user.id },
          },
        };

    const companies = await prisma.company.findMany({ where });

    return response.json(companies);
  }

  async store(request: Request, response: Response) {
    const { id } = request["tokenPayload"];

    const user = await prisma.representativeUser.findUniqueOrThrow({
      where: { id },
    });

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
    } = request.body;

    const useCase = new CreateCompanyUseCase();

    const company = await useCase.handle({
      industryId: Number(industryId),
      corporateName,
      email,
      fantasyName,
      phone,
      registeredNumber,
      zipCode,
      paymentPlanId,
      representativeId: user.representativeId,
    });

    if (consultantId) {
      await prisma.representativeUserCompany.create({
        data: { companyId: company.id, representativeUserId: consultantId },
      });
    }

    const findUseCase = new FindOneCompanyUseCase();
    const findUser = new FindCompanyUsersUseCase();
    const registerTakebackMethod =
      new RegisterCompanyTakebackPaymentMethodsUseCase();
    const allowCompanyAccess = new AllowCompanyFirstAccessUseCase();

    await allowCompanyAccess.execute({
      companyId: company.id,
      ...companyUserData,
    });

    await registerTakebackMethod.execute({ companyId: company.id });

    await findUseCase.execute({ companyId: company.id });

    await findUser.execute({ companyId: company.id });

    return response.status(201).json(company);
  }

  async update(request: Request, response: Response) {
    const props = request.body;
    const { id } = request["tokenPayload"];
    const companyId = request.params.id;

    const update = new UpdateCompanyUseCase();
    const find = new FindOneCompanyUseCase();

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
    });

    const companies = await find.execute({ companyId });

    await prisma.representativeUserCompany.deleteMany({
      where: { companyId },
    });

    await prisma.representativeUserCompany.create({
      data: { companyId, representativeUserId: props.consultantId },
    });

    return response.status(200).json({ message, companies });
  }

  async forgotPasswordToRootUser(request: Request, response: Response) {
    const companyId = request.params.id;
    const { userName, email } = request.body;

    const forgot = new ForgotPasswordToRootUserUseCase();
    const findUser = new FindCompanyUsersUseCase();

    const message = await forgot.execute({ companyId, email, userName });
    const users = await findUser.execute({ companyId });

    return response.status(200).json({ message, users });
  }
}
