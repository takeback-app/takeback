import { Request, Response } from "express";
import { FindAllSupportUsersUseCase } from "./FindAllSupportUsersUseCase";
import { RegisterSupportUserUseCase } from "./RegisterSupportUserUseCase";
import { UpdateSupportUserUseCase } from "./UpdateSupportUserUseCase";

class ManagerSupportController {
  async registerSupportUser(request: Request, response: Response) {
    const data = request.body;

    const register = new RegisterSupportUserUseCase();
    const find = new FindAllSupportUsersUseCase();

    const message = await register.execute({
      data,
    });

    const users = await find.execute();

    return response.status(201).json({ message, users });
  }

  async updateSupportUser(request: Request, response: Response) {
    const { password, cpf, mail, name, isActive } = request.body;

    const userId = request.params.id;

    const update = new UpdateSupportUserUseCase();
    const find = new FindAllSupportUsersUseCase();

    const message = await update.execute({
      userId: userId,
      isActive: isActive === "0",
      cpf,
      mail,
      name,
      password,
    });

    const users = await find.execute();

    return response.status(200).json({ message, users });
  }

  async findAllSupportUsers(request: Request, response: Response) {
    const find = new FindAllSupportUsersUseCase();

    const result = await find.execute();

    return response.status(200).json(result);
  }
}

export { ManagerSupportController };
