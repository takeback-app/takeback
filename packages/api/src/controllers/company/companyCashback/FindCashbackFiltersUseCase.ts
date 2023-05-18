import { prisma } from "../../../prisma";
class FindCashbackFiltersUseCase {
  async execute() {
    return await prisma.transactionStatus.findMany();
  }
}

export { FindCashbackFiltersUseCase };
