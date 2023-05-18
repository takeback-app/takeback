import { getRepository } from "typeorm";
import { State } from "../models/State";

function stateRepository() {
  return getRepository(State);
}

export { stateRepository };
