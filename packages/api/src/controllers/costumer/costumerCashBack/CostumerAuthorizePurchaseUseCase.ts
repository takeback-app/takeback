import bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../database/models/Consumer";
import { Transactions } from "../../../database/models/Transaction";
import { TransactionStatus } from "../../../database/models/TransactionStatus";
import { generateRandomNumber } from "../../../utils/RandomValueGenerate";

interface AuthorizePurchaseProps {
  consumerID: string;
  value: number;
  signature: string;
}

class CostumerAuthorizePurchaseUseCase {
  async execute({ consumerID, value, signature }: AuthorizePurchaseProps) {
    if (!signature) {
      throw new InternalError("Dados incompletos", 400);
    }

    const consumers = await getRepository(Consumers).findOne(consumerID, {
      select: ["id", "signature", "balance"],
    });

    const passwordMatch = await bcrypt.compare(signature, consumers.signature);

    if (!passwordMatch) {
      throw new InternalError("Assinatura incorreta", 400);
    }

    const transactionStatus = await getRepository(TransactionStatus).findOne({
      where: {
        description: "Aguardando",
      },
    });

    getRepository(Transactions).delete({
      transactionStatus,
    }); // Adicionar um where para deletar apenas a transação do usuário correto

    const newCode = generateRandomNumber(1000, 9999);

    const transaction = await getRepository(Transactions).save({
      consumers,
      totalAmount: value,
      keyTransaction: newCode,
      transactionStatus,
    });
    return { code: newCode, transactionId: transaction.id };
  }
}

export { CostumerAuthorizePurchaseUseCase };
