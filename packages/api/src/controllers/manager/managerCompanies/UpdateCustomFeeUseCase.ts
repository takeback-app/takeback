import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../database/models/Company";

interface Props {
  companyId: string;
  customIndustryFee: number;
  customIndustryFeeActive: boolean;
}

class UpdateCustomFeeUseCase {
  async execute({
    companyId,
    customIndustryFee,
    customIndustryFeeActive,
  }: Props) {
    const company = await getRepository(Companies).find({
      where: { id: companyId },
    });

    if (!company) {
      throw new InternalError("Empresa inexistente", 401);
    }

    const update = await getRepository(Companies).update(companyId, {
      customIndustryFee: customIndustryFee / 100,
      customIndustryFeeActive,
    });

    if (update.affected === 0) {
      throw new InternalError("Erro ao atualizar taxas", 401);
    }
    return "Taxa atualizada";
  }
}

export { UpdateCustomFeeUseCase };
