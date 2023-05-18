import { getRepository } from "typeorm";
import { Representative } from "../models/Representative";

function representativeRepository() {
  return getRepository(Representative);
}

export { representativeRepository };
