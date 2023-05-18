import { Request, Response } from "express";

import { RegisterUseCase } from "./RegisterUseCase";
import { FindUseCase } from "./FindUseCase";
import { UpdateUseCase } from "./UpdateUseCase";

class RepresentativeController {
  async register(req: Request, res: Response) {
    const register = new RegisterUseCase();
    const find = new FindUseCase();

    const message = await register.execute(req.body);
    const representatives = await find.execute();

    return res.status(201).json({ message, representatives });
  }

  async find(req: Request, res: Response) {
    const find = new FindUseCase();

    const result = await find.execute();

    return res.status(200).json(result);
  }

  async update(req: Request, res: Response) {
    const update = new UpdateUseCase();
    const find = new FindUseCase();

    const message = await update.execute(req.body);
    const representatives = await find.execute();

    return res.status(200).json({ message, representatives });
  }
}

export { RepresentativeController };
