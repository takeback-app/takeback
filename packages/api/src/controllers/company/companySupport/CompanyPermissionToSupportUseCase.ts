import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../database/models/Company";
import { CompanyUsers } from "../../../database/models/CompanyUsers";

interface Props {
  companyId: string;
  userId: string;
  permission: boolean;
}

class CompanyPermissionToSupportUseCase {
  async execute({ companyId, permission, userId }: Props) {
    if (!companyId || !userId) {
      throw new InternalError("Dados incompletos", 404);
    }

    const company = await getRepository(Companies).findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new InternalError("Empresa não encontrada", 404);
    }

    const user = await getRepository(CompanyUsers).findOne({
      where: { id: userId, companyUserTypes: 2 },
    });

    if (user) {
      throw new InternalError("Usuário sem permissão", 401);
    }

    const updatedPermission = await getRepository(Companies).update(companyId, {
      permissionToSupportAccess: permission,
    });

    if (!updatedPermission) {
      throw new InternalError("Houve um erro ao atualizar a empresa", 400);
    }

    return "Empresa atualizada";
  }
}

export { CompanyPermissionToSupportUseCase };
