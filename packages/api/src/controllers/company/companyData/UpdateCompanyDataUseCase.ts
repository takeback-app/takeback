import { InternalError } from "../../../config/GenerateErros";
import { prisma } from "../../../prisma";

interface Props {
  companyId: string;
  corporateName: string;
  fantasyName: string;
  email: string;
  phone: string;
  contactPhone: string;
  useCashbackAsBack: boolean;
}

class UpdateCompanyDataUseCase {
  async execute({
    companyId,
    corporateName,
    fantasyName,
    email,
    phone,
    contactPhone,
    useCashbackAsBack,
  }: Props) {
    if (!companyId || !corporateName || !fantasyName || !email || !phone) {
      throw new InternalError("Dados incompletos", 400);
    }

    await prisma.company.update({
      where: {
        id: companyId,
      },
      data: {
        corporateName,
        fantasyName,
        email,
        phone,
        contactPhone,
        useCashbackAsBack,
      },
    });

    return "Dados atualizados";
  }
}

export { UpdateCompanyDataUseCase };
