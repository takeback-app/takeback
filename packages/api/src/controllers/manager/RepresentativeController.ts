import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../prisma";
import { DateTime } from "luxon";
import { InternalError } from "../../config/GenerateErros";
import { maskCEP, maskCNPJ, maskCPF, maskPhone } from "../../utils/Masks";
import { CityFirstOrCreateUseCase } from "../../useCases/shared/CityFirstOrCreateUseCase";

const PER_PAGE = 25;

export class RepresentativeController {
  async index(request: Request, response: Response) {
    const pageQuery = request.query.page;

    const page = Number(pageQuery) || 1;

    const representatives = await prisma.representative.findMany({
      orderBy: { createdAt: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    });

    const count = await prisma.representative.count();

    return response.json({
      data: representatives,
      meta: { lastPage: Math.ceil(count / PER_PAGE) },
    });
  }

  async store(request: Request, response: Response) {
    const { user, address, ...data } = request.body;

    const representativeExists = await prisma.representative.findFirst({
      where: { cnpj: data.cnpj },
    });

    if (representativeExists) {
      throw new InternalError("Representante (CNPJ) já cadastrado", 400);
    }

    const userExists = await prisma.representativeUser.findFirst({
      where: { cpf: user.cpf },
    });

    if (userExists) {
      throw new InternalError("Representante (CPF) já cadastrado", 400);
    }

    const cityUseCase = new CityFirstOrCreateUseCase();

    const city = await cityUseCase.handle({
      ibgeCode: address.ibgeCode,
      city: address.city,
      state: address.state,
    });

    delete address.city;
    delete address.ibgeCode;
    delete address.state;

    address.cityId = city.id;

    const representativeAddress = await prisma.representativeAddress.create({
      data: address,
    });

    data.representativeAddressId = representativeAddress.id;

    const representative = await prisma.representative.create({
      data,
    });

    const userBirthday = DateTime.fromISO(user.birthday);
    const userPassword = await bcrypt.hash(user.password, 8);

    await prisma.representativeUser.create({
      data: {
        representativeId: representative.id,
        cpf: user.cpf,
        name: user.name,
        email: user.email,
        password: userPassword,
        phone: user.phone,
        role: "ADMIN",
        birthDay: userBirthday.day,
        birthMonth: userBirthday.month,
        birthYear: userBirthday.year,
      },
    });

    return response
      .status(201)
      .json({ message: "Representante cadastrado com sucesso" });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const representative = await prisma.representative.findUnique({
      where: { id },
      select: {
        fantasyName: true,
        cnpj: true,
        email: true,
        phone: true,
        isActive: true,
        commissionPercentage: true,
        consultantBonusPercentage: true,
        address: {
          select: {
            street: true,
            number: true,
            district: true,
            complement: true,
            zipCode: true,
            city: { include: { state: true } },
          },
        },
      },
    });

    const admin = await prisma.representativeUser.findFirst({
      where: { representativeId: id, role: "ADMIN" },
      select: {
        name: true,
        email: true,
        phone: true,
        cpf: true,
        birthDay: true,
        birthMonth: true,
        birthYear: true,
      },
    });

    return response.json({
      ...representative,
      cnpj: maskCNPJ(representative.cnpj),
      phone: maskPhone(representative.phone),
      address: {
        ...representative.address,
        city: String(representative.address.city.name),
        state: String(representative.address.city.state.initials),
        ibgeCode: String(representative.address.city.ibgeCode),
        zipCode: maskCEP(representative.address.zipCode),
      },
      commissionPercentage: String(+representative.commissionPercentage * 100),
      consultantBonusPercentage: String(
        +representative.consultantBonusPercentage * 100
      ),
      user: {
        ...admin,
        phone: maskPhone(admin.phone),
        cpf: maskCPF(admin.cpf),
        birthday: DateTime.fromObject({
          day: admin?.birthDay,
          month: admin?.birthMonth,
          year: admin?.birthYear,
        }).toISODate(),
      },
    });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;

    const { user, address, ...data } = request.body;

    const representative = await prisma.representative.update({
      where: { id },
      data,
    });

    const cityUseCase = new CityFirstOrCreateUseCase();

    const city = await cityUseCase.handle({
      ibgeCode: address.ibgeCode,
      city: address.city,
      state: address.state,
    });

    delete address.city;
    delete address.ibgeCode;
    delete address.state;

    address.cityId = city.id;

    await prisma.representativeAddress.update({
      where: { id: representative.representativeAddressId },
      data: address,
    });

    const userBirthday = DateTime.fromISO(user.birthday);

    const userPassword = data.password
      ? await bcrypt.hash(user.password, 8)
      : undefined;

    await prisma.representativeUser.updateMany({
      where: { representativeId: id, role: "ADMIN" },
      data: {
        representativeId: representative.id,
        cpf: user.cpf,
        name: user.name,
        email: user.email,
        password: userPassword,
        phone: user.phone,
        role: "ADMIN",
        birthDay: userBirthday.day,
        birthMonth: userBirthday.month,
        birthYear: userBirthday.year,
      },
    });

    return response.json({ message: "Representante atualizado com sucesso" });
  }

  async deactivate(request: Request, response: Response) {
    const { id } = request.params;

    await prisma.representative.update({
      where: { id },
      data: { isActive: false },
    });

    await prisma.representativeUser.updateMany({
      where: { representativeId: id },
      data: { isActive: false },
    });

    await prisma.company.updateMany({
      where: { representativeId: id },
      data: { representativeId: null },
    });

    return response.json({ message: "Representante desativado" });
  }

  async activate(request: Request, response: Response) {
    const { id } = request.params;

    await prisma.representative.update({
      where: { id },
      data: { isActive: true },
    });

    await prisma.representativeUser.updateMany({
      where: { representativeId: id },
      data: { isActive: true },
    });

    return response.json({ message: "Representante ativado" });
  }
}
