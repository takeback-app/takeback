import { Request, Response } from "express";
import StorageFactory from "../../services/Storage";

export class FileController {
  async store(request: Request, response: Response) {
    const file = request.file;

    const url = await StorageFactory.getStorage().upload(file);

    return response.json({ message: "Salvo com sucesso", url });
  }
}
