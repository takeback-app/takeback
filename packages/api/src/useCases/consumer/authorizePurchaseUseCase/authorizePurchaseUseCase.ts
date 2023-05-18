import bcrypt from "bcrypt";
import { InternalError } from "../../../config/GenerateErros";
import { TransactionStatusEnum } from "../../../enum/TransactionStatusEnum";
import { prisma } from "../../../prisma";
import { generateRandomNumber } from "../../../utils/RandomValueGenerate";

interface AuthorizePurchaseProps {
  costumerId: string;
  value: number;
  password: string;
}

export class AuthorizePurchaseUseCase {
  async execute(props: AuthorizePurchaseProps) {
    if (!props.password) {
      throw new InternalError("Dados incompletos", 400);
    }

    const consumer = await prisma.consumer.findUnique({
      where: { id: props.costumerId },
      select: { id: true, password: true },
    });

    const passwordMatch = await bcrypt.compare(
      props.password,
      consumer.password
    );

    if (!passwordMatch) {
      throw new InternalError("Assinatura incorreta", 400);
    }

    const transactionStatus = await prisma.transactionStatus.findFirst({
      where: {
        description: TransactionStatusEnum.WAITING,
      },
    });

    await prisma.transaction.deleteMany({
      where: {
        consumersId: consumer.id,
        transactionStatusId: transactionStatus.id,
        keyTransaction: { not: null },
      },
    });

    const newCode = generateRandomNumber(1000, 9999);

    const transaction = await prisma.transaction.create({
      data: {
        consumersId: consumer.id,
        totalAmount: props.value,
        keyTransaction: newCode,
        transactionStatusId: transactionStatus.id,
      },
    });

    return { code: newCode, transactionId: transaction.id };
  }
}
