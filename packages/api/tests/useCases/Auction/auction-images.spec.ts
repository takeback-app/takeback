import { test } from "@japa/runner";
import sharp from "sharp";
import { unlink } from "fs/promises";
import { v4 as uuid } from "uuid";
import {
  isAuctionImageUrl,
  normalizeAuctionImage,
  UploadAuctionImageUseCase,
} from "../../../src/useCases/auction/AuctionImages";

function image(width: number, height: number, format: "jpeg" | "png" | "gif") {
  return sharp({
    create: { width, height, channels: 3, background: "#ff8800" },
  })
    .withMetadata({ exif: { IFD0: { Copyright: "secret-location" } } })
    .toFormat(format)
    .toBuffer();
}

test.group("Auction images", () => {
  test("it should re-encode a valid image as jpeg without metadata", async ({
    assert,
  }) => {
    const input = await image(400, 300, "jpeg");
    assert.isDefined((await sharp(input).metadata()).exif);

    const output = await normalizeAuctionImage(input);
    const metadata = await sharp(output).metadata();

    assert.equal(metadata.format, "jpeg");
    assert.isUndefined(metadata.exif);
    assert.equal(metadata.width, 400);
  });

  test("it should shrink large images to 1600px", async ({ assert }) => {
    const output = await normalizeAuctionImage(await image(4000, 3000, "png"));
    const metadata = await sharp(output).metadata();

    assert.equal(metadata.width, 1600);
    assert.equal(metadata.height, 1200);
  });

  test("it should reject files that are not allowed images", async ({
    assert,
  }) => {
    await assert.rejects(
      () => normalizeAuctionImage(Buffer.from("not an image")),
      "Arquivo de imagem inválido. Use JPG, PNG ou WEBP."
    );
    await assert.rejects(
      async () => normalizeAuctionImage(await image(10, 10, "gif")),
      "Arquivo de imagem inválido. Use JPG, PNG ou WEBP."
    );
  });

  test("it should store the image and return an accepted url", async ({
    assert,
  }) => {
    const { url } = await new UploadAuctionImageUseCase().execute({
      buffer: await image(200, 200, "png"),
      originalname: "../../etc/passwd.png",
      mimetype: "image/png",
    } as Express.Multer.File);

    assert.isTrue(isAuctionImageUrl(url));
    assert.notInclude(url, "passwd");

    await unlink(`uploads/${url.split("/uploads/")[1]}`);
  });

  test("it should accept only urls of images uploaded for auctions", ({
    assert,
  }) => {
    const base = `${process.env.API_URL}/uploads`;

    assert.isTrue(isAuctionImageUrl(`${base}/${uuid()}-desapega.jpg`));
    assert.isFalse(isAuctionImageUrl(`https://evil.com/${uuid()}-desapega.jpg`));
    assert.isFalse(isAuctionImageUrl(`${base}/${uuid()}-logo.png`));
    assert.isFalse(isAuctionImageUrl(`${base}/../${uuid()}-desapega.jpg`));
    assert.isFalse(isAuctionImageUrl(`${base}/x/${uuid()}-desapega.jpg`));
  });
});
