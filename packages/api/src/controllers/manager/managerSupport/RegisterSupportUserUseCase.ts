import bcrypt from "bcrypt";
import { InternalError } from "../../../config/GenerateErros";
import { getRepository } from "typeorm";
import { SupportUsers } from "../../../database/models/SupportUsers";
import { CPFValidate } from "../../../utils/CPFValidate";

interface DataProps {
  name: string;
  mail: string;
  cpf: string;
  password: string;
}

interface Props {
  data: DataProps;
}

class RegisterSupportUserUseCase {
  async execute({ data }: Props) {
    if (!data.name || !data.cpf || !data.mail || !data.password) {
      throw new InternalError("Dados incompletos", 400);
    }

    if (!CPFValidate(data.cpf.replace(/\D/g, ""))) {
      throw new InternalError("CPF Inválido", 400);
    }

    const supportCPFName = await getRepository(SupportUsers).findOne({
      where: [{ cpf: data.cpf }, { name: data.name }],
    });

    if (supportCPFName) {
      throw new InternalError("Usuário suporte já cadastrado", 400);
    }

    const passwordEncrypted = bcrypt.hashSync(data.password, 10);

    const newSupportUser = await getRepository(SupportUsers).save({
      name: data.name,
      password: passwordEncrypted,
      isActive: true,
      cpf: data.cpf,
      mail: data.mail,
    });

    if (newSupportUser) {
      return "Usuário cadastrado";
    } else {
      throw new InternalError("Erro ao cadastrar usuário", 401);
    }
  }
}

export { RegisterSupportUserUseCase };
