import { test } from "@japa/runner";
import { AuctionStatus } from "@prisma/client";
import { prisma } from "../../../src/prisma";
import { GetAuctionDetailUseCase } from "../../../src/useCases/auction/GetAuctionDetailUseCase";
import { createAuction, createSeller, enableAuctions } from "./utils/auction-data";

const hour = 60 * 60 * 1000;

test.group("Auction detail", (group) => {
  group.deleteTables();

  test("it should return the public data of an active auction", async ({
    assert,
  }) => {
    await enableAuctions();
    const seller = await createSeller();
    const created = await createAuction({
      sellerId: seller.id,
      attentionPoints: "Pneu traseiro murcho",
      imageUrls: ["https://cdn/1.jpg", "https://cdn/2.jpg", "https://cdn/3.jpg"],
    });

    const auction = await new GetAuctionDetailUseCase().execute({
      id: created.id,
    });

    assert.sameMembers(Object.keys(auction), [
      "id",
      "title",
      "description",
      "attentionPoints",
      "imageUrls",
      "startingBid",
      "minimumIncrement",
      "highestBid",
      "currentBid",
      "nextMinimumBid",
      "bidsCount",
      "publishedAt",
      "endsAt",
      "isFinished",
    ]);
    assert.equal(auction.title, "Bicicleta aro 29");
    assert.equal(auction.attentionPoints, "Pneu traseiro murcho");
    assert.deepEqual(auction.imageUrls, [
      "https://cdn/1.jpg",
      "https://cdn/2.jpg",
      "https://cdn/3.jpg",
    ]);
    assert.isFalse(auction.isFinished);
  });

  test("it should not expose seller data", async ({ assert }) => {
    await enableAuctions();
    const seller = await createSeller();
    const created = await createAuction({ sellerId: seller.id });

    const serialized = JSON.stringify(
      await new GetAuctionDetailUseCase().execute({ id: created.id })
    );

    assert.notInclude(serialized, seller.id);
    assert.notInclude(serialized, seller.fullName);
    assert.notInclude(serialized, seller.cpf);
    assert.notInclude(serialized, seller.email);
    assert.notInclude(serialized, seller.phone);
  });

  test("it should require the starting bid when there are no bids", async ({
    assert,
  }) => {
    await enableAuctions();
    const seller = await createSeller();
    const created = await createAuction({
      sellerId: seller.id,
      startingBid: 100,
      minimumIncrement: 5,
    });

    const auction = await new GetAuctionDetailUseCase().execute({
      id: created.id,
    });

    assert.isNull(auction.highestBid);
    assert.equal(auction.currentBid, 100);
    assert.equal(auction.nextMinimumBid, 100);
  });

  test("it should add the increment to the highest bid", async ({
    assert,
  }) => {
    await enableAuctions();
    const seller = await createSeller();
    const created = await createAuction({
      sellerId: seller.id,
      startingBid: 100,
      minimumIncrement: 2.5,
      highestBid: 120.1,
      bidsCount: 2,
    });

    const auction = await new GetAuctionDetailUseCase().execute({
      id: created.id,
    });

    assert.equal(auction.currentBid, 120.1);
    assert.equal(auction.nextMinimumBid, 122.6);
    assert.equal(auction.bidsCount, 2);
  });

  test("it should hide auctions with status {$self}")
    .with([AuctionStatus.DRAFT, AuctionStatus.SUSPENDED, AuctionStatus.CANCELED])
    .run(async ({ assert }, status) => {
      await enableAuctions();
      const seller = await createSeller();
      const created = await createAuction({ sellerId: seller.id, status });

      await assert.rejects(
        () => new GetAuctionDetailUseCase().execute({ id: created.id }),
        "Anúncio não encontrado"
      );
    });

  test("it should show an auction past its deadline as finished", async ({
    assert,
  }) => {
    await enableAuctions();
    const seller = await createSeller();
    const created = await createAuction({
      sellerId: seller.id,
      endsAt: new Date(Date.now() - hour),
    });

    const auction = await new GetAuctionDetailUseCase().execute({
      id: created.id,
    });

    assert.isTrue(auction.isFinished);
  });

  test("it should show closed auctions as finished", async ({ assert }) => {
    await enableAuctions();
    const seller = await createSeller();
    const created = await createAuction({
      sellerId: seller.id,
      status: AuctionStatus.FINISHED_WITH_WINNER,
      highestBid: 150,
      bidsCount: 4,
    });

    const auction = await new GetAuctionDetailUseCase().execute({
      id: created.id,
    });

    assert.isTrue(auction.isFinished);
    assert.equal(auction.currentBid, 150);
  });

  test("it should fail for an unknown auction", async ({ assert }) => {
    await enableAuctions();

    await assert.rejects(
      () =>
        new GetAuctionDetailUseCase().execute({
          id: "00000000-0000-0000-0000-000000000000",
        }),
      "Anúncio não encontrado"
    );
  });

  test("it should refuse when the feature is disabled", async ({ assert }) => {
    await prisma.auctionSetting.create({ data: { isEnabled: false } });
    const seller = await createSeller();
    const created = await createAuction({ sellerId: seller.id });

    await assert.rejects(
      () => new GetAuctionDetailUseCase().execute({ id: created.id }),
      "O Desapega não está disponível no momento"
    );
  });
});
