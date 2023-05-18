import { getRepository } from "typeorm";
import { ZipCodes } from "../models/ZipCodes";

function zipCodeRepository() {
  return getRepository(ZipCodes);
}

export { zipCodeRepository };
