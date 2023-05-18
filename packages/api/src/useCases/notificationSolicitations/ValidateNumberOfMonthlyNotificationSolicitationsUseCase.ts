import { DateTime } from "luxon";
import { InternalError } from "../../config/GenerateErros";
import { prisma } from "../../prisma";

export class ValidateNumberOfMonthlyNotificationSolicitationsUseCase {
  public async execute(companyId: string) {
    const {
      numberMaxOfMonthlyNotificationSolicitations,
      numberOfNotificationSolicitationThisMonth,
    } = await this.getCount(companyId);

    if (
      numberOfNotificationSolicitationThisMonth >=
      numberMaxOfMonthlyNotificationSolicitations
    ) {
      throw new InternalError("Limite mensal de sorteios atingidos.", 400);
    }
  }

  public async getCount(companyId: string) {
    const dateState = DateTime.now().startOf("month").toJSDate();
    const dateEnd = DateTime.now().endOf("month").toJSDate();

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        paymentPlan: {
          select: {
            numberOfMonthlyNotificationSolicitations: true,
          },
        },
        _count: {
          select: {
            notificationSolicitations: {
              where: {
                createdAt: { gte: dateState, lte: dateEnd },
                status: "APPROVED",
              },
            },
          },
        },
      },
    });

    return {
      numberOfNotificationSolicitationThisMonth:
        company._count.notificationSolicitations,
      numberMaxOfMonthlyNotificationSolicitations:
        company.paymentPlan.numberOfMonthlyNotificationSolicitations,
    };
  }
}
