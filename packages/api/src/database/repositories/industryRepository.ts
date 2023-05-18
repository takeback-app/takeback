import { getRepository } from "typeorm";
import { Industries } from "../models/Industry";

function industryRepository() {
  return getRepository(Industries);
}

export { industryRepository };
