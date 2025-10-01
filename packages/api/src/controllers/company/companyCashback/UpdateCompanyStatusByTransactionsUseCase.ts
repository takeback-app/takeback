import { prisma } from '../../../prisma'
import { TransactionStatusEnum } from '../../../enum/TransactionStatusEnum'
import { CompanyStatusEnum } from '../../../enum/CompanyStatusEnum'

export class UpdateCompanyStatusByTransactionsUseCase {
  async execute(companyId: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        companyStatus: { select: { description: true } },
      },
    })

    if (company.companyStatus.description === CompanyStatusEnum.BLOCKED) return

    const onDelayStatus = await prisma.transactionStatus.findFirst({
      where: { description: TransactionStatusEnum.ON_DELAY },
    })

    const overdueTransactionCounter = await prisma.transaction.count({
      where: {
        companiesId: companyId,
        transactionStatusId: onDelayStatus.id,
      },
    })

    const status = await prisma.companyStatus.findFirst({
      where: {
        description: overdueTransactionCounter
          ? CompanyStatusEnum.CASHBACK_DEFAULTER
          : CompanyStatusEnum.ACTIVE,
      },
    })

    await prisma.company.update({
      where: { id: companyId },
      data: { statusId: status.id },
    })
  }
}
