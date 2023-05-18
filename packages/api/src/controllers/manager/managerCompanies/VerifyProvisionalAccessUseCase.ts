import { getRepository } from "typeorm";
import { Companies } from "../../../database/models/Company";
import { CompanyStatus } from "../../../database/models/CompanyStatus";
import { Settings } from "../../../database/models/Settings";

class VerifyProvisionalAccessUseCase {
  async execute() {
    const settings = await getRepository(Settings).findOne(1);
    const companiesBloqued = [];

    const provisonalAccess = await getRepository(CompanyStatus).findOne({
      where: { description: "Liberação provisória" },
    });

    const companiesInProvisionalAccess = await getRepository(Companies).find({
      where: { status: provisonalAccess },
      relations: ["status"],
    });

    const today = new Date();
    const blockedStatus = await getRepository(CompanyStatus).findOne({
      where: { description: "Bloqueado" },
    });

    companiesInProvisionalAccess.map(async (item) => {
      let provisionalAccessDate = new Date(item.provisionalAccessAllowedAt);

      let expirateDate = new Date(
        provisionalAccessDate.setDate(
          provisionalAccessDate.getDate() + settings.provisionalAccessDays
        )
      );

      if (today > expirateDate) {
        await getRepository(Companies).update(item.id, {
          status: blockedStatus,
        });
        companiesBloqued.push(item.id);
      }
    });

    return {
      message: `Verificação de acesso provisório completa! Foram bloqueadas ${companiesBloqued.length} empresas.`,
    };
  }
}

export { VerifyProvisionalAccessUseCase };
