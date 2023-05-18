import { getRepository } from "typeorm";
import { TransactionStatus } from "../../../database/models/TransactionStatus";

class FindCashbackStatusUseCase {
  async execute() {
    const status = await getRepository(TransactionStatus).find({
      select: ["id", "description"],
    });

    return status;
  }
}

export { FindCashbackStatusUseCase };
