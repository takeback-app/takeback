import { prisma } from "../../../prisma";
class FindCashbackStatusUseCase {
  async execute() {
    return await prisma.transactionStatus.findMany();
  }
}

export { FindCashbackStatusUseCase };
