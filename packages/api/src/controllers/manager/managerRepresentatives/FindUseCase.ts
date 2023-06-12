import { prisma } from "../../../prisma";

class FindUseCase {
  async execute() {
    const representatives = await prisma.representative.findMany({
      orderBy: { createdAt: "desc" },
    });

    return representatives;
  }
}

export { FindUseCase };
