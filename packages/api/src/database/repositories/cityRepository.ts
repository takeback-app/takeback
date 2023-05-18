import { getRepository } from "typeorm";
import { City } from "../models/City";

function cityRepository() {
  return getRepository(City);
}

export { cityRepository };
