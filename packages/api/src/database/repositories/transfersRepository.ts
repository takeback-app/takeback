import { getRepository } from "typeorm";
import { Transfers } from "../models/Transfers";

function transfersRepository() {
  return getRepository(Transfers);
}

export { transfersRepository };
