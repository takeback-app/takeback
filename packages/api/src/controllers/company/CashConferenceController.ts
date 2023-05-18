import { Request, Response } from "express";
import { InternalError } from "../../config/GenerateErros";
import { CashConferenceRequest } from "../../requests/CashConferenceRequest";
import { CaseConferenceUseCase } from "../../useCases/company/CaseConferenceUseCase";

export class CashConferenceController {
  async handle(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const form = CashConferenceRequest.safeParse(request.query);

    if (!form.success) {
      throw new InternalError("Existem erros nos dados enviados.", 422);
    }

    const { date, type } = form.data;

    const useCase = new CaseConferenceUseCase();

    const data = await useCase.execute({ date, type, companyId });

    return response.json(data);
  }
}
