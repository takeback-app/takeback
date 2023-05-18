import bcrypt from "bcrypt";
import { InternalError } from "../../../config/GenerateErros";
import { getRepository } from "typeorm";
import { SupportUsers } from "../../../database/models/SupportUsers";
import { CPFValidate } from "../../../utils/CPFValidate";

interface Props {
  userId: string;
  name?: string;
  mail?: string;
  cpf?: string;
  password?: string;
  isActive: boolean;
}

class UpdateSupportUserUseCase {
  async execute({ name, password, mail, cpf, userId, isActive }: Props) {
    if (!mail || !name || !cpf) {
      return new InternalError("Dados incompletos", 400);
    }

    if (!CPFValidate(cpf.replace(/\D/g, ""))) {
      throw new InternalError("CPF Inválido", 400);
    }

    const supportUser = await getRepository(SupportUsers).findOne({
      where: { id: userId },
    });

    if (!supportUser) {
      return new InternalError("Usuário suporte não encontrado", 400);
    }

    if (password.length > 0) {
      const passwordEncrypted = bcrypt.hashSync(password, 10);

      const newSupportUser = await getRepository(SupportUsers).update(userId, {
        name,
        password: passwordEncrypted,
        isActive,
        cpf,
        mail,
      });

      if (newSupportUser) {
        return "Usuário atualizado";
      }

      return new InternalError("Houve um erro na criação do usuário", 400);
    } else {
      const newSupportUser = await getRepository(SupportUsers).update(userId, {
        name,
        isActive,
        cpf,
        mail,
      });

      if (newSupportUser) {
        return "Usuário atualizado";
      }

      return new InternalError("Houve um erro na criação do usuário", 400);
    }
  }
}

export { UpdateSupportUserUseCase };
