import { Request, Response } from "express";
import { prisma } from "../../../prisma";

function toDays(milliseconds: number) {
  return milliseconds / (1000 * 3600 * 24);
}

class CompanyStatusController {
  async verify(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const pendentStatusId = 1;
    const processingStatusId = 7;
    const overdueStatusId = 8;

    const data = await prisma.transaction.groupBy({
      by: ["companiesId"],
      where: {
        companiesId: companyId,
        transactionStatusId: {
          in: [pendentStatusId, processingStatusId, overdueStatusId],
        },
      },
      _min: {
        createdAt: true,
      },
    });

    if (!data.length) {
      return response.json({ hasWarning: false, message: "OK" });
    }

    const today = new Date();
    const transactionCreatedAt = data[0]._min.createdAt;

    const diffInDays = toDays(Math.abs(+today - +transactionCreatedAt));

    if (diffInDays >= 10) {
      return response.json({
        hasWarning: true,
        message:
          "Você tem cashbacks inadimplentes. Regularize para continuar utilizando o sistema.",
      });
    }

    if (diffInDays >= 8) {
      return response.json({
        hasWarning: true,
        message:
          "Faltam alguns dias para você ficar com cashbacks inadimplentes. Regularize para continuar utilizando o sistema.",
      });
    }

    return response.json({ hasWarning: false, message: "OK" });
  }
}

export { CompanyStatusController };
