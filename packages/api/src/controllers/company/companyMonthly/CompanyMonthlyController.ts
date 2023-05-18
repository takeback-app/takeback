import { Request, Response } from "express";
import { FindAllCompanyMontlhiesUseCase } from "./FindAllCompanyMontlhiesUseCase";
import { FindPaymentInfoUseCase } from "./FindPaymentInfoUseCase";
import { InformTheMonthlyPaymentUseCase } from "./InformTheMonthlyPaymentUseCase";

class CompanyMontlhyController {
  async findCompanyMonthly(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const findUseCase = new FindAllCompanyMontlhiesUseCase();
    const findInfo = new FindPaymentInfoUseCase();

    const company = await findUseCase.execute(companyId);
    const paymentInfo = await findInfo.execute();

    return response.status(200).json({ company, paymentInfo });
  }

  async informMonthlyPayment(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    const { id } = request.params;

    const inform = new InformTheMonthlyPaymentUseCase();
    const findUseCase = new FindAllCompanyMontlhiesUseCase();

    const message = await inform.execute({ montlhyId: parseInt(id) });

    const company = await findUseCase.execute(companyId);

    return response.status(200).json({ message, company });
  }
}

export { CompanyMontlhyController };
