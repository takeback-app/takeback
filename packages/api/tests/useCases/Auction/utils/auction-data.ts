import { AuctionStatus, Prisma } from "@prisma/client";
import { prisma } from "../../../../src/prisma";

export async function createSeller(cpf = "14077950660") {
  return prisma.consumer.create({
    data: {
      cpf,
      email: `${cpf}@test.com`,
      fullName: "Vendedor Teste",
      phone: "31999999999",
      password: "hash",
    },
  });
}

export async function enableAuctions() {
  await prisma.auctionSetting.create({ data: { isEnabled: true } });
}

type AuctionData = Partial<Prisma.AuctionUncheckedCreateInput> & {
  sellerId: string;
  imageUrls?: string[];
};

export async function createAuction({ imageUrls = [], ...data }: AuctionData) {
  return prisma.auction.create({
    data: {
      title: "Bicicleta aro 29",
      description: "Pouco usada",
      startingBid: 100,
      minimumIncrement: 5,
      status: AuctionStatus.ACTIVE,
      publishedAt: new Date(),
      endsAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      ...data,
      images: {
        create: imageUrls.map((url, order) => ({ url, order })),
      },
    },
  });
}
