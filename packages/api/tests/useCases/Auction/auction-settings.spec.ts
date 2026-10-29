import { test } from "@japa/runner";
import { AuctionStatus } from "@prisma/client";
import { prisma } from "../../../src/prisma";
import { GetAuctionSettingsUseCase } from "../../../src/useCases/auction/GetAuctionSettingsUseCase";
import { UpdateAuctionSettingsUseCase } from "../../../src/useCases/auction/UpdateAuctionSettingsUseCase";
import { UpdateAuctionSettingsRequest } from "../../../src/requests/UpdateAuctionSettingsRequest";
import { canTransitionAuction } from "../../../src/useCases/auction/AuctionStatusTransitions";
import { createAuction, createSeller } from "./utils/auction-data";

const validSettings = {
  isEnabled: true,
  defaultDurationHours: 72,
  listingFee: 2.99,
  minimumStartingBid: 5,
  defaultMinimumIncrement: 2.5,
};

test.group("Auction settings", (group) => {
  group.deleteTables();

  test("it should return the default settings when none were saved", async ({
    assert,
  }) => {
    const settings = await new GetAuctionSettingsUseCase().execute();

    assert.deepEqual(settings, {
      isEnabled: false,
      defaultDurationHours: 48,
      listingFee: 0,
      minimumStartingBid: 1,
      defaultMinimumIncrement: 1,
    });
    assert.equal(await prisma.auctionSetting.count(), 1);
  });

  test("it should update the settings and keep a single row", async ({
    assert,
  }) => {
    await new GetAuctionSettingsUseCase().execute();

    const updated = await new UpdateAuctionSettingsUseCase().execute(
      validSettings
    );

    assert.deepEqual(updated, validSettings);
    assert.deepEqual(
      await new GetAuctionSettingsUseCase().execute(),
      validSettings
    );
    assert.equal(await prisma.auctionSetting.count(), 1);
  });

  test("it should not change auctions already published", async ({
    assert,
  }) => {
    const seller = await createSeller();
    const auction = await createAuction({ sellerId: seller.id });

    await new UpdateAuctionSettingsUseCase().execute(validSettings);

    const unchanged = await prisma.auction.findUnique({
      where: { id: auction.id },
    });

    assert.equal(Number(unchanged.startingBid), 100);
    assert.equal(Number(unchanged.minimumIncrement), 5);
    assert.equal(unchanged.endsAt.getTime(), auction.endsAt.getTime());
  });

  test("it should reject invalid settings")
    .with([
      { ...validSettings, defaultDurationHours: 0 },
      { ...validSettings, defaultDurationHours: 1.5 },
      { ...validSettings, listingFee: -1 },
      { ...validSettings, minimumStartingBid: 0 },
      { ...validSettings, defaultMinimumIncrement: 0 },
      { ...validSettings, defaultMinimumIncrement: 1.234 },
      { ...validSettings, extra: true },
    ])
    .run(({ assert }, payload) => {
      assert.isFalse(UpdateAuctionSettingsRequest.safeParse(payload).success);
    });

  test("it should accept a zero listing fee", ({ assert }) => {
    assert.isTrue(
      UpdateAuctionSettingsRequest.safeParse({
        ...validSettings,
        listingFee: 0,
      }).success
    );
  });

  test("it should follow the auction lifecycle", ({ assert }) => {
    assert.isTrue(
      canTransitionAuction(AuctionStatus.DRAFT, AuctionStatus.ACTIVE)
    );
    assert.isTrue(
      canTransitionAuction(
        AuctionStatus.ACTIVE,
        AuctionStatus.FINISHED_WITH_WINNER
      )
    );
    assert.isTrue(
      canTransitionAuction(
        AuctionStatus.FINISHED_WITH_WINNER,
        AuctionStatus.NEGOTIATING
      )
    );
    assert.isTrue(
      canTransitionAuction(AuctionStatus.NEGOTIATING, AuctionStatus.DELIVERED)
    );
    assert.isFalse(
      canTransitionAuction(AuctionStatus.DRAFT, AuctionStatus.DELIVERED)
    );
    assert.isFalse(
      canTransitionAuction(AuctionStatus.DELIVERED, AuctionStatus.ACTIVE)
    );
    assert.isFalse(
      canTransitionAuction(
        AuctionStatus.FINISHED_WITHOUT_BIDS,
        AuctionStatus.ACTIVE
      )
    );
  });
});
