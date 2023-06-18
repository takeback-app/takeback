import sharp from "sharp";

export class ResizeImageUseCase {
  public static async handle(image: Express.Multer.File, size: number) {
    image.buffer = await sharp(image.buffer).resize(null, size).toBuffer();

    return image;
  }
}
