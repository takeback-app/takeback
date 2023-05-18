import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../database/models/Company";
import { CompanyStatus } from "../../../database/models/CompanyStatus";

interface Props {
  statusId: number;
  companyId: string;
}

class UpdadeCompanyStatusUseCase {
  async execute({ statusId, companyId }: Props) {
    const status = await getRepository(CompanyStatus).findOne(statusId);
    const company = await getRepository(Companies).findOne({
      where: { id: companyId },
      relations: ["status", "users"],
    });

    if (!status || !company) {
      throw new InternalError("Status inexistente", 404);
    }

    if (status.description === "Liberação provisória") {
      throw new InternalError("Operação não permitida", 400);
    }

    if (!status.blocked && company.users.length === 0) {
      throw new InternalError(
        `O status '${status.description}' não é permitido para empresas que não possuem usuários`,
        400
      );
    }

    const updateStatus = await getRepository(Companies).update(companyId, {
      status,
    });

    if (updateStatus.affected === 0) {
      throw new InternalError("Erro ao atualizar status", 500);
    }

    return "Status atualizado";
  }
}

export { UpdadeCompanyStatusUseCase };
