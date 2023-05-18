import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { logger } from "./logger";

interface IStorage {
  upload: (file: Express.Multer.File) => Promise<string>;
}

class S3Storage implements IStorage {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_S3_DEFAULT_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = process.env.AWS_S3_BUCKET_TICKETS;
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const id = uuidv4();
    const filePath = `${id}-${file.originalname}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filePath,
        Body: file.buffer,
        ACL: "public-read",
      });

      await this.s3Client.send(command);

      return `https://${this.bucketName}.s3.${process.env.AWS_S3_DEFAULT_REGION}.amazonaws.com/${filePath}`;
    } catch (error) {
      logger.error(error);
      throw new Error("Falha ao salvar arquivo");
    }
  }
}

class LocalStorage implements IStorage {
  private localPath: string;

  constructor() {
    this.localPath = "uploads";
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const id = uuidv4();
    const filePath = `${id}-${file.originalname}`;

    try {
      await fs.writeFile(`${this.localPath}/${filePath}`, file.buffer);

      return `${process.env.API_URL}/${this.localPath}/${filePath}`;
    } catch (error) {
      logger.error(error);
      throw new Error("Falha ao salvar arquivo");
    }
  }
}

class StorageFactory {
  static getStorage(): IStorage {
    switch (process.env.STORAGE_TYPE) {
      case "s3":
        return new S3Storage();

      case "local":
        return new LocalStorage();

      default:
        throw new Error("Erro");
    }
  }
}

export default StorageFactory;
