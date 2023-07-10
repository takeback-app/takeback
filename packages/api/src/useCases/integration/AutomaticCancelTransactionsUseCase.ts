import { NFCeValidationStatus, Prisma } from '@prisma/client'
import { DateTime } from 'luxon'
import { prisma } from '../../prisma'
import { CancelCashBackUseCase } from '../../controllers/company/companyCashback/CancelCashBackUseCase'
import { TransactionStatusEnum } from '../../enum/TransactionStatusEnum'

export class AutomaticCancelTransactionsUseCase {
  async handle() {
    const cancelUseCase = new CancelCashBackUseCase()

    const companiesWithIntegration =
      await this.getCompanyAndTransactionsToCancel(true)

    const companiesWithoutIntegration =
      await this.getCompanyAndTransactionsToCancel(false)

    const companies = companiesWithIntegration.concat(
      companiesWithoutIntegration,
    )

    for (const company of companies) {
      const cancellationDescription = company.integrationSettings
        ? 'NFC-e não encontrada'
        : 'Prazo máximo de pagamento excedido'

      await cancelUseCase.execute({
        cancellationDescription,
        companyId: company.id,
        transactionIDs: company.transactions.map((t) => t.id),
      })
    }
  }

  async getCompanyAndTransactionsToCancel(integrated: boolean) {
    const transactionFilter: Prisma.TransactionWhereInput = {
      transactionStatus: { description: TransactionStatusEnum.PENDING },
      nfceValidationStatus: NFCeValidationStatus.NOT_FOUND,
      createdAt: {
        lte: DateTime.now()
          .minus({ day: integrated ? 4 : 30 })
          .toJSDate(),
      },
    }

    return prisma.company.findMany({
      where: {
        transactions: { some: transactionFilter },
        integrationSettings: integrated ? { isNot: null } : null,
      },
      select: {
        id: true,
        transactions: { where: transactionFilter },
        integrationSettings: { select: { id: true } },
      },
    })
  }
}
