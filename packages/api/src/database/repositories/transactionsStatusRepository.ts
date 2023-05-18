import { getRepository } from "typeorm";
import { TransactionStatus } from "../models/TransactionStatus";

function transactionsStatusRepository() {
  return getRepository(TransactionStatus);
}

export { transactionsStatusRepository };
