import bcrypt from "bcrypt";
import { InternalError } from "../../../config/GenerateErros";
import { consumerRepository } from "../../../database/repositories/consumerRepository";
import { transfersRepository } from "../../../database/repositories/transfersRepository";

interface TransferBalanceProps {
  consumerId: string;
  sentConsumerId: string;
  value: number;
  password: string;
}

export class TransferBalanceUseCase {
  async execute(props: TransferBalanceProps) {
    if (
      !props.sentConsumerId ||
      !props.consumerId ||
      !props.password ||
      !props.value ||
      props.value <= 0 ||
      typeof props.value !== "number"
    ) {
      throw new InternalError("Dados incompletos", 400);
    }

    const consumer = await consumerRepository().findOne({
      select: ["id", "balance", "password"],
      where: {
        id: props.consumerId,
      },
    });

    if (consumer.balance < props.value) {
      throw new InternalError("Saldo insuficiente", 400);
    }

    const passwordMatch = await bcrypt.compare(
      props.password,
      consumer.password
    );

    if (!passwordMatch) {
      throw new InternalError("Erro ao confirmar transferência", 400);
    }

    const consumerTransfer = await consumerRepository().findOne({
      select: ["id", "deactivedAccount", "balance"],
      where: {
        id: props.sentConsumerId,
      },
    });

    if (!consumerTransfer) {
      throw new InternalError("Usuário não encontrado", 400);
    }

    if (consumerTransfer.deactivedAccount) {
      throw new InternalError("Usuário inativo", 400);
    }

    if (consumerTransfer.id === props.consumerId) {
      throw new InternalError("Não é possível transferir para si mesmo", 400);
    }

    const newTransfer = await transfersRepository().save({
      consumerReceived: consumerTransfer,
      consumerSent: consumer,
      value: props.value,
    });

    if (!newTransfer) {
      throw new InternalError("erro ao efetuar transferência", 400);
    }

    const sentConsumerUpdate = await consumerRepository().update(consumer.id, {
      balance: consumer.balance - props.value,
    });

    if (!sentConsumerUpdate.affected) {
      throw new InternalError("erro ao efetuar transferência", 400);
    }

    const receivedConsumerUpdate = await consumerRepository().update(
      consumerTransfer.id,
      {
        balance: consumerTransfer.balance + props.value,
      }
    );

    if (!receivedConsumerUpdate.affected) {
      throw new InternalError("erro ao efetuar transferência", 400);
    }

    return "Sucesso";
  }
}
