import { test } from "@japa/runner";
import { AuctionStatus } from "@prisma/client";
import { prisma } from "../../../src/prisma";
import { ListActiveAuctionsUseCase } from "../../../src/useCases/auction/ListActiveAuctionsUseCase";
import { createAuction, createSeller, enableAuctions } from "./utils/auction-data";

const hour = 60 * 60 * 1000;

test.group("List active auctions", (group) => {
  group.deleteTables();

  test("it should list only active auctions within the deadline", async ({
    assert,
  }) => {
    await enableAuctions();
    const seller = await createSeller();
    const now = new Date();

    const active = await createAuction({ sellerId: seller.id });

    await createAuction({ sellerId: seller.id, status: AuctionStatus.DRAFT });
    await createAuction({
      sellerId: seller.id,
      status: AuctionStatus.SUSPENDED,
    });
    await createAuction({
      sellerId: seller.id,
      status: AuctionStatus.CANCELED,
    });
    await createAuction({
      sellerId: seller.id,
      status: AuctionStatus.FINISHED_WITHOUT_BIDS,
    });
    await createAuction({
      sellerId: seller.id,
      endsAt: new Date(now.getTime() - hour),
    });

    const auctions = await new ListActiveAuctionsUseCase().execute({
      page: 1,
      limit: 15,
      now,
    });

    assert.lengthOf(auctions, 1);
    assert.equal(auctions[0].id, active.id);
  });

  test("it should not expose seller data", async ({ assert }) => {
    await enableAuctions();
    const seller = await createSeller();
    await createAuction({
      sellerId: seller.id,
      imageUrls: ["https://cdn/2.jpg", "https://cdn/1.jpg"],
    });

    const [auction] = await new ListActiveAuctionsUseCase().execute({
      page: 1,
      limit: 15,
    });

    assert.sameMembers(Object.keys(auction), [
      "id",
      "title",
      "imageUrl",
      "startingBid",
      "highestBid",
      "currentBid",
      "bidsCount",
      "endsAt",
    ]);

    const serialized = JSON.stringify(auction);

    assert.notInclude(serialized, seller.id);
    assert.notInclude(serialized, seller.fullName);
    assert.notInclude(serialized, seller.cpf);
    assert.notInclude(serialized, seller.email);
    assert.notInclude(serialized, seller.phone);
    assert.equal(auction.imageUrl, "https://cdn/2.jpg");
  });

  test("it should use the highest bid when there is one", async ({
    assert,
  }) => {
    await enableAuctions();
    const seller = await createSeller();
    await createAuction({
      sellerId: seller.id,
      startingBid: 50,
      highestBid: 80.5,
      bidsCount: 3,
    });

    const [auction] = await new ListActiveAuctionsUseCase().execute({
      page: 1,
      limit: 15,
    });

    assert.equal(auction.startingBid, 50);
    assert.equal(auction.highestBid, 80.5);
    assert.equal(auction.currentBid, 80.5);
    assert.equal(auction.bidsCount, 3);
    assert.isNull(auction.imageUrl);
  });

  test("it should order by deadline and paginate", async ({ assert }) => {
    await enableAuctions();
    const seller = await createSeller();
    const now = Date.now();

    const third = await createAuction({
      sellerId: seller.id,
      endsAt: new Date(now + 30 * hour),
    });
    const first = await createAuction({
      sellerId: seller.id,
      endsAt: new Date(now + 1 * hour),
    });
    const second = await createAuction({
      sellerId: seller.id,
      endsAt: new Date(now + 10 * hour),
    });

    const useCase = new ListActiveAuctionsUseCase();

    const firstPage = await useCase.execute({ page: 1, limit: 2 });
    const secondPage = await useCase.execute({ page: 2, limit: 2 });

    assert.deepEqual(
      firstPage.map((a) => a.id),
      [first.id, second.id]
    );
    assert.deepEqual(
      secondPage.map((a) => a.id),
      [third.id]
    );
  });

  test("it should filter by title ignoring case", async ({ assert }) => {
    await enableAuctions();
    const seller = await createSeller();

    const bike = await createAuction({
      sellerId: seller.id,
      title: "Bicicleta aro 29",
    });
    await createAuction({ sellerId: seller.id, title: "Geladeira frost free" });

    const auctions = await new ListActiveAuctionsUseCase().execute({
      page: 1,
      limit: 15,
      search: "BICICLETA",
    });

    assert.deepEqual(
      auctions.map((a) => a.id),
      [bike.id]
    );
  });

  test("it should refuse to list when the feature is disabled", async ({
    assert,
  }) => {
    await prisma.auctionSetting.create({ data: { isEnabled: false } });

    await assert.rejects(
      () =>
        new ListActiveAuctionsUseCase().execute({ page: 1, limit: 15 }),
      "O Desapega não está disponível no momento"
    );
  });
});
