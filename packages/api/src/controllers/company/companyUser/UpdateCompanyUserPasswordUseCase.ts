import bcrypt from "bcrypt";
import { InternalError } from "../../../config/GenerateErros";

import { prisma } from "../../../prisma";

interface Props {
  password: string;
  newPassword: string;
  companyId: string;
  userId: string;
}

class UpdateCompanyPasswordUseCase {
  async execute({ companyId, newPassword, password, userId }: Props) {
    if (!password || !newPassword) {
      throw new InternalError("Dados incompletos", 400);
    }

    //Verificando se o usuário logado é suporte
    const userSupport = await prisma.supportUser.findFirst({
      where: { id: userId },
    });

    if (userSupport) {
      throw new InternalError(
        "Somente o usuário Administrativo Takeback pode alterar a senha do usuário suporte.",
        400
      );
    }

    const companyUser = await prisma.companyUser.findFirst({
      where: { id: userId },
      select: { id: true, password: true },
    });

    const passwordMatch = await bcrypt.compare(password, companyUser.password);

    if (!passwordMatch) {
      throw new InternalError("Senha incorreta", 400);
    }

    const newPasswordEncrypted = bcrypt.hashSync(newPassword, 10);

    await prisma.companyUser.update({
      where: { id: userId },
      data: { password: newPasswordEncrypted },
    });

    return "Senha atualizada!";
  }
}

export { UpdateCompanyPasswordUseCase };
