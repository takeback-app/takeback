import { InternalError } from "../../config/GenerateErros";
import { generateToken } from "../../config/JWT";
import { prisma } from "../../prisma";
import bcrypt from "bcrypt";

interface SignInRepresentativeDTO {
  cpf: string;
  password: string;
}

export class SignInRepresentativeUseCase {
  async handle({ password, cpf }: SignInRepresentativeDTO) {
    if (!cpf || !password) {
      throw new InternalError("Dados incompletos", 400);
    }

    const user = await prisma.representativeUser.findUnique({
      where: { cpf },
      include: {
        representative: { select: { isActive: true, fantasyName: true } },
      },
    });

    if (!user) {
      throw new InternalError("Erro ao realizar login", 401);
    }

    if (!user.isActive || !user.representative.isActive) {
      throw new InternalError("Não autorizado", 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new InternalError("Erro ao realizar login", 401);
    }

    const token = generateToken(
      {
        id: user.id,
        representativeId: user.representativeId,
        representativeName: user.representative.fantasyName,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_PRIVATE_KEY,
      parseInt(process.env.JWT_EXPIRES_IN)
    );

    return {
      token,
      id: user.id,
      representativeId: user.representativeId,
      representativeName: user.representative.fantasyName,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
