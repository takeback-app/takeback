import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../database/models/Company";
import { Representative } from "../../../database/models/Representative";

interface RelationWithRepresentativeUseCaseProps {
  companyId: string;
  representativeId: string;
}

class RelationWithRepresentativeUseCase {
  async execute(props: RelationWithRepresentativeUseCaseProps) {
    if (!props.companyId) {
      throw new InternalError("Dados incompletos", 400);
    }

    if (props.representativeId === "0") {
      await getRepository(Companies)
        .update(props.companyId, {
          representative: null,
        })
        .catch((err) => {
          throw new InternalError(err.message, 400);
        });

      return "Representante alterado com sucesso!";
    }

    const representative = await getRepository(Representative)
      .findOne({
        where: {
          id: props.representativeId,
        },
      })
      .catch((err) => {
        throw new InternalError(err.message, 400);
      });

    if (!representative) {
      throw new InternalError("Representante não encontrado", 404);
    }

    await getRepository(Companies)
      .update(props.companyId, {
        representative,
      })
      .catch((err) => {
        throw new InternalError(err.message, 400);
      });

    return "Representante alterado com sucesso!";
  }
}

export { RelationWithRepresentativeUseCase };
