import { getRepository } from "typeorm";
import { ConsumerAddress } from "../models/ConsumerAddress";

function consumerAddressRepository() {
  return getRepository(ConsumerAddress);
}

export { consumerAddressRepository };
