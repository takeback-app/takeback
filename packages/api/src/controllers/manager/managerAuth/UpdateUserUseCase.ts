import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { TakeBackUsers } from "../../../database/models/TakeBackUsers";
import { TakeBackUserTypes } from "../../../database/models/TakeBackUserTypes";
import { CPFValidate } from "../../../utils/CPFValidate";

interface Props {
  name: string;
  cpf: string;
  email: string;
  id: string;
  userTypeId: string;
  isActive: boolean;
  phone: string;
  userId: string;
}

class UpdateUserUseCase {
  async execute({
    name,
    cpf,
    email,
    isActive,
    phone,
    userTypeId,
    id,
    userId,
  }: Props) {
    if (!cpf || !name || !email || !phone || !userTypeId) {
      throw new InternalError("Dados incompletos", 400);
    }

    const userAccess = await getRepository(TakeBackUsers).findOne({
      where: { id: userId },
      relations: ["userType"],
    });

    if (userAccess.userType.id !== 1 && userAccess.userType.id !== 2) {
      throw new InternalError("Não autorizado", 401);
    }

    const user = await getRepository(TakeBackUsers).findOne({
      where: { id },
      relations: ["userType"],
    });

    if (!user) {
      throw new InternalError("Usuário não encontrado", 400);
    }

    if (user.userType.isRoot && !userAccess.userType.isRoot) {
      throw new InternalError("Não autorizado", 401);
    }

    const userType = await getRepository(TakeBackUserTypes).findOne(
      parseInt(userTypeId)
    );

    if (!userType) {
      throw new InternalError("Tipo de usuário inexistente", 401);
    }

    if (!CPFValidate(cpf.replace(/[^\d]/g, ""))) {
      throw new InternalError("Cpf inválido", 400);
    }

    const updateUser = await getRepository(TakeBackUsers).update(id, {
      name,
      cpf,
      email,
      phone,
      userType,
      isActive,
    });

    if (updateUser.affected === 0) {
      throw new InternalError("Erro ao atualizar usuário", 500);
    }

    return "Usuário atualizado";
  }
}

export { UpdateUserUseCase };
