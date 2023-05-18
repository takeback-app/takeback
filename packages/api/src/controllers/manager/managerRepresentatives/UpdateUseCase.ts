import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Representative } from "../../../database/models/Representative";
import { CPFValidate } from "../../../utils/CPFValidate";

interface UpdateUseCaseProps {
  id: string;
  name: string;
  cpf: string;
  phone?: string;
  email: string;
  whatsapp?: string;
  isActive?: boolean;
  gainPercentage: number;
}

class UpdateUseCase {
  async execute(props: UpdateUseCaseProps) {
    if (
      !props.id ||
      !props.name ||
      !props.cpf ||
      !props.gainPercentage ||
      !props.email
    ) {
      throw new InternalError("Dados incompletos", 400);
    }

    if (!CPFValidate(props.cpf.replace(/[^\d]/g, ""))) {
      throw new InternalError("CPF inválido", 400);
    }

    const representative = await getRepository(Representative).findOne({
      where: { id: props.id, cpf: props.cpf.replace(/\D/g, "") },
    });

    if (!representative) {
      throw new InternalError(
        "Usuário não encontrado ou CPF já cadastrado para outro representante",
        400
      );
    }

    await getRepository(Representative)
      .update(props.id, {
        name: props.name.toLowerCase(),
        cpf: props.cpf.replace(/\D/g, ""),
        email: props.email.toLowerCase(),
        phone: props.phone || "",
        whatsapp: props.whatsapp || "",
        gainPercentage: props.gainPercentage,
        isActive: props.isActive,
      })
      .catch((err) => {
        if (err) {
          throw new InternalError(err.message, 400);
        }
      });

    return { message: "Usuário alterado com sucesso!" };
  }
}

export { UpdateUseCase };
