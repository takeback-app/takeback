import { getRepository } from "typeorm";
import { Companies } from "../../../database/models/Company";

interface Props {
  companyId: string;
}

class FindStatusPermissionToSupportUseCase {
  async execute({ companyId }: Props) {
    const permission = await getRepository(Companies).findOne({
      select: ["permissionToSupportAccess"],
      where: { id: companyId },
    });

    return permission;
  }
}

export { FindStatusPermissionToSupportUseCase };
