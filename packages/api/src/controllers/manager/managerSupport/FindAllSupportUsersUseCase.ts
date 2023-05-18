import { getRepository } from "typeorm";
import { SupportUsers } from "../../../database/models/SupportUsers";

class FindAllSupportUsersUseCase {
  async execute() {
    const users = await getRepository(SupportUsers).find({
      select: ["id", "name", "mail", "isActive", "cpf", "password"],
    });

    return users;
  }
}

export { FindAllSupportUsersUseCase };
