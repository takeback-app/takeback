import { InternalError } from "../../../config/GenerateErros";

import { redis } from "../../../redis";

interface Props {
  cpf: string;
  companyId: string;
}

class GetConsumerAutocompleteUseCase {
  async execute({ cpf, companyId }: Props) {
    if (!cpf) {
      throw new InternalError("CPF não informado", 400);
    }

    const TAG = "autocomplete";

    const keys = await redis.keys(`${TAG}:${companyId}:${cpf}*`);

    if (!keys.length) return [];

    return await redis.mget(keys);
  }
}

export { GetConsumerAutocompleteUseCase };
