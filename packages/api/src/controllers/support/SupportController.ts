import { Request, Response } from "express";

import { GenerateSeedDataUseCase } from "./GenerateSeedDataUseCase";
import { TestSendMailsUseCase } from "./TestSendMailsUseCase";

class SupportController {
  async generateSeeds(request: Request, response: Response) {
    const req = request.body;
    const generateSeeds = new GenerateSeedDataUseCase();

    const result = await generateSeeds.execute(req);

    return response.status(200).json(result);
  }

  async testSendMail(request: Request, response: Response) {
    const req = request.body;
    const testeSendMail = new TestSendMailsUseCase();

    const result = await testeSendMail.execute({ mail: req.mail });

    return response.status(200).json(result);
  }
}

export { SupportController };
