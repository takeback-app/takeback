import { prisma } from "../../prisma";

interface Dto {
  ibgeCode: string;
  city?: string;
  state?: string;
}

export class CityFirstOrCreateUseCase {
  async handle(dto: Dto) {
    const city = await prisma.city.findFirst({
      where: { ibgeCode: dto.ibgeCode },
    });

    if (city) return city;

    if (!dto.city || !dto.state) {
      return null;
    }

    const state = await prisma.state.findFirst({
      where: { initials: dto.state },
    });

    return prisma.city.create({
      data: {
        name: dto.city,
        ibgeCode: dto.ibgeCode,
        stateId: state.id,
      },
    });
  }
}
