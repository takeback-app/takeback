import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Transactions } from "../../../database/models/Transaction";

interface DropTransactionProps {
  transactionID: string;
}

class CostumerDropTransactionUseCase {
  async execute({ transactionID }: DropTransactionProps) {
    const transaction = await getRepository(Transactions).findOne(
      transactionID,
      {
        relations: ["transactionStatus"],
      }
    );

    if (transaction.transactionStatus.description !== "Aguardando") {
      throw new InternalError(
        "Não foi possível cancelar a chave, pois a mesma já foi utilizada.",
        400
      );
    }

    await getRepository(Transactions).delete(transactionID);

    return { message: "Operação cancelada" };
  }
}

export { CostumerDropTransactionUseCase };
