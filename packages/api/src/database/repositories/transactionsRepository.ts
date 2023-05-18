import { getRepository } from "typeorm";
import { Transactions } from "../models/Transaction";

function transactionsRepository() {
  return getRepository(Transactions);
}

export { transactionsRepository };
