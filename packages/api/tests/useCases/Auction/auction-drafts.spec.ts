import { test } from "@japa/runner";
import { AuctionStatus } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { prisma } from "../../../src/prisma";
import { SaveAuctionDraftRequest } from "../../../src/requests/SaveAuctionDraftRequest";
import {
  DeleteAuctionDraftUseCase,
  GetOwnAuctionUseCase,
  ListOwnAuctionsUseCase,
  MAX_DRAFTS_PER_SELLER,
  SaveAuctionDraftUseCase,
} from "../../../src/useCases/auction/OwnAuctionsUseCases";
import { createAuction, createSeller } from "./utils/auction-data";

const imageUrl = () => `${process.env.API_URL}/uploads/${uuid()}-desapega.jpg`;

function draft(overrides = {}) {
  return {
    title: "Mesa de jantar",
    description: "Mesa de madeira maciça com seis lugares",
    attentionPoints: "Uma perna está riscada",
    startingBid: 200,
    minimumIncrement: 10,
    imageUrls: [imageUrl(), imageUrl()],
    ...overrides,
  };
}

async function enableWith(
  minimumStartingBid = 1,
  defaultMinimumIncrement = 1
) {
  await prisma.auctionSetting.create({
    data: { isEnabled: true, minimumStartingBid, defaultMinimumIncrement },
  });
}

test.group("Auction drafts", (group) => {
  group.deleteTables();

  test("it should create a draft owned by the seller", async ({ assert }) => {
    await enableWith();
    const seller = await createSeller();
    const data = draft();

    const saved = await new SaveAuctionDraftUseCase().execute(seller.id, data);

    assert.equal(saved.status, AuctionStatus.DRAFT);
    assert.deepEqual(saved.imageUrls, data.imageUrls);
    assert.equal(saved.startingBid, 200);
    assert.equal(saved.minimumIncrement, 10);

    const stored = await prisma.auction.findUnique({ where: { id: saved.id } });

    assert.equal(stored.sellerId, seller.id);
    assert.isNull(stored.publishedAt);
    assert.isNull(stored.endsAt);
  });

  test("it should apply the default increment when none is informed", async ({
    assert,
  }) => {
    await enableWith(1, 2.5);
    const seller = await createSeller();

    const saved = await new SaveAuctionDraftUseCase().execute(
      seller.id,
      draft({ minimumIncrement: undefined })
    );

    assert.equal(saved.minimumIncrement, 2.5);
  });

  test("it should enforce the configured minimums", async ({ assert }) => {
    await enableWith(50, 5);
    const seller = await createSeller();
    const useCase = new SaveAuctionDraftUseCase();

    await assert.rejects(
      () => useCase.execute(seller.id, draft({ startingBid: 49.99 })),
      "O lance inicial deve ser de pelo menos R$ 50,00"
    );
    await assert.rejects(
      () => useCase.execute(seller.id, draft({ minimumIncrement: 4 })),
      "O incremento mínimo deve ser de pelo menos R$ 5,00"
    );
  });

  test("it should reject images that were not uploaded for auctions", async ({
    assert,
  }) => {
    await enableWith();
    const seller = await createSeller();

    await assert.rejects(
      () =>
        new SaveAuctionDraftUseCase().execute(
          seller.id,
          draft({ imageUrls: ["https://evil.com/photo.jpg"] })
        ),
      "Envie as fotos pelo aplicativo antes de salvar"
    );
  });

  test("it should ignore repeated images", async ({ assert }) => {
    await enableWith();
    const seller = await createSeller();
    const url = imageUrl();

    const saved = await new SaveAuctionDraftUseCase().execute(
      seller.id,
      draft({ imageUrls: [url, url] })
    );

    assert.deepEqual(saved.imageUrls, [url]);
  });

  test("it should update the draft and replace its images", async ({
    assert,
  }) => {
    await enableWith();
    const seller = await createSeller();
    const useCase = new SaveAuctionDraftUseCase();
    const saved = await useCase.execute(seller.id, draft());
    const newImages = [imageUrl()];

    const updated = await useCase.execute(
      seller.id,
      draft({ title: "Mesa redonda", attentionPoints: "", imageUrls: newImages }),
      saved.id
    );

    assert.equal(updated.title, "Mesa redonda");
    assert.isNull(updated.attentionPoints);
    assert.deepEqual(updated.imageUrls, newImages);
    assert.equal(
      await prisma.auctionImage.count({ where: { auctionId: saved.id } }),
      1
    );
  });

  test("it should not let another consumer read, edit or delete a draft", async ({
    assert,
  }) => {
    await enableWith();
    const seller = await createSeller();
    const intruder = await createSeller("52998224725");
    const saved = await new SaveAuctionDraftUseCase().execute(
      seller.id,
      draft()
    );

    await assert.rejects(
      () => new GetOwnAuctionUseCase().execute(intruder.id, saved.id),
      "Anúncio não encontrado"
    );
    await assert.rejects(
      () =>
        new SaveAuctionDraftUseCase().execute(
          intruder.id,
          draft({ title: "Invadido" }),
          saved.id
        ),
      "Anúncio não encontrado"
    );
    await assert.rejects(
      () => new DeleteAuctionDraftUseCase().execute(intruder.id, saved.id),
      "Anúncio não encontrado"
    );
    assert.deepEqual(
      await new ListOwnAuctionsUseCase().execute(intruder.id),
      []
    );

    const untouched = await prisma.auction.findUnique({
      where: { id: saved.id },
    });

    assert.equal(untouched.title, "Mesa de jantar");
  });

  test("it should not edit or delete an auction that is no longer a draft", async ({
    assert,
  }) => {
    await enableWith();
    const seller = await createSeller();
    const active = await createAuction({ sellerId: seller.id });

    await assert.rejects(
      () => new SaveAuctionDraftUseCase().execute(seller.id, draft(), active.id),
      "Anúncio não encontrado"
    );
    await assert.rejects(
      () => new DeleteAuctionDraftUseCase().execute(seller.id, active.id),
      "Anúncio não encontrado"
    );
  });

  test("it should delete the seller's own draft", async ({ assert }) => {
    await enableWith();
    const seller = await createSeller();
    const saved = await new SaveAuctionDraftUseCase().execute(
      seller.id,
      draft()
    );

    await new DeleteAuctionDraftUseCase().execute(seller.id, saved.id);

    assert.equal(await prisma.auction.count(), 0);
    assert.equal(await prisma.auctionImage.count(), 0);
  });

  test("it should list only the seller's auctions filtered by status", async ({
    assert,
  }) => {
    await enableWith();
    const seller = await createSeller();
    const saved = await new SaveAuctionDraftUseCase().execute(
      seller.id,
      draft()
    );
    await createAuction({ sellerId: seller.id });

    const drafts = await new ListOwnAuctionsUseCase().execute(
      seller.id,
      AuctionStatus.DRAFT
    );
    const all = await new ListOwnAuctionsUseCase().execute(seller.id);

    assert.deepEqual(
      drafts.map((a) => a.id),
      [saved.id]
    );
    assert.lengthOf(all, 2);
  });

  test("it should limit the number of drafts per seller", async ({
    assert,
  }) => {
    await enableWith();
    const seller = await createSeller();

    for (let i = 0; i < MAX_DRAFTS_PER_SELLER; i++) {
      await createAuction({ sellerId: seller.id, status: AuctionStatus.DRAFT });
    }

    await assert.rejects(
      () => new SaveAuctionDraftUseCase().execute(seller.id, draft()),
      `Você pode ter no máximo ${MAX_DRAFTS_PER_SELLER} rascunhos`
    );
  });

  test("it should refuse drafts when the feature is disabled", async ({
    assert,
  }) => {
    await prisma.auctionSetting.create({ data: { isEnabled: false } });
    const seller = await createSeller();

    await assert.rejects(
      () => new SaveAuctionDraftUseCase().execute(seller.id, draft()),
      "O Desapega não está disponível no momento"
    );
  });

  test("it should reject an invalid form")
    .with([
      { title: "ab" },
      { title: "x".repeat(81) },
      { description: "curta" },
      { attentionPoints: "x".repeat(1001) },
      { startingBid: "200" },
      { startingBid: 10.123 },
      { imageUrls: [] },
      { imageUrls: Array.from({ length: 7 }, imageUrl) },
      { sellerId: uuid() },
    ])
    .run(({ assert }, overrides) => {
      assert.isFalse(SaveAuctionDraftRequest.safeParse(draft(overrides)).success);
    });

  test("it should accept a draft without attention points", ({ assert }) => {
    assert.isTrue(
      SaveAuctionDraftRequest.safeParse(draft({ attentionPoints: undefined }))
        .success
    );
  });
});
