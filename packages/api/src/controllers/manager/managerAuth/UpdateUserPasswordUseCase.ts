import bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { TakeBackUsers } from "../../../database/models/TakeBackUsers";

interface Props {
  password: string;
  newPassword: string;
  userId: string;
}

class UpdateUserPasswordUseCase {
  async execute({ newPassword, password, userId }: Props) {
    if (!newPassword || !password) {
      throw new InternalError("Dados incompletos", 400);
    }

    const user = await getRepository(TakeBackUsers).findOne(userId, {
      select: ["id", "password"],
    });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new InternalError("Senha incorreta", 400);
    }

    const newPasswordEncrypted = bcrypt.hashSync(newPassword, 10);

    const updated = await getRepository(TakeBackUsers).update(userId, {
      password: newPasswordEncrypted,
    });

    if (updated.affected === 0) {
      throw new InternalError("Houve um erro ao atualizar sua senha", 400);
    }

    return "Senha atualizada";
  }
}

export { UpdateUserPasswordUseCase };
