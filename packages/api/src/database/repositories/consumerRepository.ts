import { getRepository } from "typeorm";
import { Consumers } from "../models/Consumer";

function consumerRepository() {
  return getRepository(Consumers);
}

export { consumerRepository };
