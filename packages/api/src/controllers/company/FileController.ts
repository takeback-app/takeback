import { Request, Response } from "express";

import StorageFactory from "../../services/Storage";
import { ResizeImageUseCase } from "../../useCases/shared/ResizeImageUseCase";

export class FileController {
  async store(request: Request, response: Response) {
    const { resize } = request.query;

    let file = request.file;

    if (resize) {
      file = await ResizeImageUseCase.handle(file, Number(resize));
    }

    const url = await StorageFactory.getStorage().upload(file);

    return response.json({ message: "Salvo com sucesso", url });
  }
}
