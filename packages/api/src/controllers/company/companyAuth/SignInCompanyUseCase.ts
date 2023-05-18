import bcrypt from "bcrypt";
import { InternalError } from "../../../config/GenerateErros";
import { generateToken } from "../../../config/JWT";

import { prisma } from "../../../prisma";

interface Props {
  user: string;
  password: string;
}

class SignInCompanyUseCase {
  async execute({ user, password }: Props) {
    // Verificando se todos os dados necessários foram informados
    if (!user || !password) {
      throw new InternalError("Dados incompletos", 400);
    }

    const companyUser = await prisma.companyUser.findFirst({
      where: {
        cpf: user.replace(/\D/g, ""),
      },
      include: {
        company: {
          include: {
            companyStatus: true,
          },
        },
        companyUserType: true,
      },
    });

    const company = companyUser?.company;

    // Verificando se a empresa foi localizada
    if (!company) {
      throw new InternalError("Erro ao realizar login", 400);
    }

    // Verificando se a empresa está bloqueada
    if (company.companyStatus.blocked) {
      throw new InternalError("Erro ao realizar login", 400);
    }

    // Caso a empresa permita o acesso do usuário suporte, o IF será executado
    if (company.permissionToSupportAccess) {
      const [prefixUser, cpfUser] = user.split("/");

      if (prefixUser && prefixUser.toLowerCase() === "suporte") {
        // Buscando aquele determinado usuário suporte
        const supportUser = await prisma.supportUser.findFirst({
          where: { cpf: cpfUser.replace(/\D/g, "") },
        });

        if (!supportUser) {
          throw new InternalError("Erro ao realizar login", 401);
        }

        // Verificando se a senha informada está correta
        const passwordMatch = await bcrypt.compare(
          password,
          supportUser.password
        );

        if (!passwordMatch) {
          throw new InternalError("Erro ao realizar login", 400);
        }

        if (!supportUser.isActive) {
          throw new InternalError("Usuário não autorizado", 400);
        }

        const token = generateToken(
          {
            companyId: company.id,
            generateCashback: company.companyStatus.generateCashback,
            userId: supportUser.id,
            isManager: true,
            name: supportUser.name,
            office: "Suporte",
            isRootUser: true,
            cpf: supportUser.cpf,
            companyName: company.fantasyName,
          },
          process.env.JWT_PRIVATE_KEY,
          parseInt(process.env.JWT_EXPIRES_IN)
        );

        return {
          token,
          generateCashback: company.companyStatus.generateCashback,
          isManager: true,
          name: supportUser.name,
          office: "Suporte",
          companyId: company.id,
          isRootUser: true,
          cpf: supportUser.cpf,
          companyName: company.fantasyName,
        };
      }

      // Verificando se o usuário existe
      if (!companyUser) {
        throw new InternalError("Erro ao realizar login", 400);
      }

      // Verificando se o usuário encontrado está ativo
      if (
        !companyUser.isActive ||
        !companyUser.password ||
        companyUser.password.length === 0
      ) {
        throw new InternalError("Usuário não autorizado", 400);
      }

      // Verificando se a senha informada está correta
      const passwordMatch = await bcrypt.compare(
        password,
        companyUser.password
      );

      if (!passwordMatch) {
        throw new InternalError("Erro ao realizar login", 400);
      }

      // Gerando token
      const token = generateToken(
        {
          companyId: company.id,
          generateCashback: company.companyStatus.generateCashback,
          userId: companyUser.id,
          isManager: companyUser.companyUserType?.isManager,
          name: companyUser.name,
          office: companyUser.companyUserType?.description,
          isRootUser: companyUser.isRootUser,
          cpf: companyUser.cpf,
          companyName: company.fantasyName,
        },
        process.env.JWT_PRIVATE_KEY,
        parseInt(process.env.JWT_EXPIRES_IN)
      );

      return {
        token,
        generateCashback: company.companyStatus.generateCashback,
        isManager: companyUser.companyUserType?.isManager || false,
        name: companyUser.name,
        office: companyUser.companyUserType?.description,
        companyId: company.id,
        isRootUser: companyUser.isRootUser,
        cpf: companyUser.cpf,
        companyName: company.fantasyName,
      };
    }

    // Verificando se o usuário existe
    if (!companyUser) {
      throw new InternalError("Erro ao realizar login", 400);
    }

    // Verificando se o usuário encontrado está ativo
    if (
      !companyUser.isActive ||
      !companyUser.password ||
      companyUser.password.length === 0
    ) {
      throw new InternalError("Usuário não autorizado", 400);
    }

    // Verificando se a senha informada está correta
    const passwordMatch = await bcrypt.compare(password, companyUser.password);
    if (!passwordMatch) {
      throw new InternalError("Erro ao realizar login", 400);
    }

    const token = generateToken(
      {
        companyId: company.id,
        generateCashback: company.companyStatus.generateCashback,
        userId: companyUser.id,
        isManager: companyUser.companyUserType.isManager,
        name: companyUser.name,
        office: companyUser.companyUserType.description,
        isRootUser: companyUser.isRootUser,
        cpf: companyUser.cpf,
        companyName: company.fantasyName,
      },
      process.env.JWT_PRIVATE_KEY,
      parseInt(process.env.JWT_EXPIRES_IN)
    );

    return {
      token,
      generateCashback: company.companyStatus.generateCashback,
      isManager: companyUser.companyUserType.isManager,
      name: companyUser.name,
      office: companyUser.companyUserType.description,
      companyId: company.id,
      isRootUser: companyUser.isRootUser,
      cpf: companyUser.cpf,
      companyName: company.fantasyName,
    };
  }
}

export { SignInCompanyUseCase };
