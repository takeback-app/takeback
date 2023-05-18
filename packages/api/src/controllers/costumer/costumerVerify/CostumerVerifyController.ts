import { Request, Response } from "express";
import { CostumerSendMailToVerifyUseCase } from "./CostumerSendMailToVerifyUseCase";
import { CostumerVerifyEmailUseCase } from "./CostumerVerifyEmailUseCase";

class CostumerVerifyController {
  async sendMailToVerify(request: Request, response: Response) {
    const consumerID = request["tokenPayload"].id;

    const send = new CostumerSendMailToVerifyUseCase();

    const result = await send.execute({ consumerID });

    response.status(200).json(result);
  }

  async verifyEmail(request: Request, response: Response) {
    const consumerID = request["tokenPayload"].id;

    const { code } = request.body;

    const verify = new CostumerVerifyEmailUseCase();

    const result = await verify.execute({
      code,
      consumerID,
    });

    response.status(200).json(result);
  }
}

export { CostumerVerifyController };
