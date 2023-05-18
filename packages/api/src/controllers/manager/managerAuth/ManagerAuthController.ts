import { Request, Response } from "express";
import { FindUserTypeUseCase } from "./FindUserTypeUseCase";
import { FindUserUseCase } from "./FindUserUseCase";
import { RegisterUserUseCase } from "./RegisterUserUseCase";
import { SignInUserUseCase } from "./SignInUserUseCase";
import { UpdateUserUseCase } from "./UpdateUserUseCase";
import { VerifyTokenUseCase } from "./VerifyTokenUseCase";
import { UpdateUserPasswordUseCase } from "./UpdateUserPasswordUseCase";
import { ForgotPasswordUseCase } from "./ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "./ResetPasswordUseCase";

class ManagerAuthController {
  async registerUser(request: Request, response: Response) {
    const { id } = request["tokenPayload"];
    const data = request.body;

    const registerUser = new RegisterUserUseCase();
    const find = new FindUserUseCase();

    const message = await registerUser.execute({ data, userId: id });

    const users = await find.execute({
      limit: "12",
      offset: "0",
      userId: id,
    });

    return response.status(201).json({ message, users });
  }

  async signInUser(request: Request, response: Response) {
    const { cpf, password } = request.body;

    const userLogin = new SignInUserUseCase();

    const result = await userLogin.execute({ cpf, password });

    return response.status(200).json(result);
  }

  async updateUser(request: Request, response: Response) {
    const { id } = request["tokenPayload"];
    const userId = request.params.id;
    const { name, cpf, email, isActive, phone, userTypeId } = request.body;

    const update = new UpdateUserUseCase();
    const find = new FindUserUseCase();

    const message = await update.execute({
      name,
      cpf,
      email,
      isActive: isActive === "0",
      phone,
      userTypeId,
      id: userId,
      userId: id,
    });

    const users = await find.execute({
      limit: "12",
      offset: "0",
      userId: id,
    });

    return response.status(200).json({ message, users });
  }

  async findUser(request: Request, response: Response) {
    const { id } = request["tokenPayload"];
    const { offset, limit } = request.params;

    const findUsers = new FindUserUseCase();

    const result = await findUsers.execute({
      userId: id,
      offset,
      limit,
    });

    return response.status(200).json(result);
  }

  async verifyToken(request: Request, response: Response) {
    const token = request.headers.authorization;

    const verifyToken = new VerifyTokenUseCase();

    const result = await verifyToken.execute({ token });

    return response.status(200).json(result);
  }

  async findUserType(request: Request, response: Response) {
    const { id } = request["tokenPayload"];
    const findUserTypes = new FindUserTypeUseCase();

    const result = await findUserTypes.execute(id);

    return response.status(200).json(result);
  }

  async updateUserPassword(request: Request, response: Response) {
    const { id } = request["tokenPayload"];
    const { newPassword, password } = request.body;

    const update = new UpdateUserPasswordUseCase();

    const result = await update.execute({ newPassword, password, userId: id });

    return response.status(200).json(result);
  }

  async resetPassword(request: Request, response: Response) {
    const { token, newPassword } = request.body;

    const reset = new ResetPasswordUseCase();

    const message = await reset.execute({ newPassword, token });

    return response.status(200).json({ message });
  }

  async forgotPassword(request: Request, response: Response) {
    const { cpf } = request.body;

    const update = new ForgotPasswordUseCase();

    const message = await update.execute({ cpf });

    return response.status(200).json({ message });
  }
}

export { ManagerAuthController };
