import { prisma } from "../../../prisma";
import { TransactionStatusEnum } from "../../../enum/TransactionStatusEnum";
import { CompanyStatusEnum } from "../../../enum/CompanyStatusEnum";

export class UpdateCompanyStatusByTransactionsUseCase {
  async execute(companyId: string) {
    const overdueTransactionCounter = await prisma.transaction.count({
      where: {
        companiesId: companyId,
        transactionStatus: { description: TransactionStatusEnum.ON_DELAY },
      },
    });

    const status = await prisma.companyStatus.findFirst({
      where: {
        description: !!overdueTransactionCounter
          ? CompanyStatusEnum.CASHBACK_DEFAULTER
          : CompanyStatusEnum.ACTIVE,
      },
    });

    await prisma.company.update({
      where: { id: companyId },
      data: { statusId: status.id },
    });
  }
}
