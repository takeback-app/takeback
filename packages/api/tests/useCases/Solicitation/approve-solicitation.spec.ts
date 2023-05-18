import { test } from "@japa/runner";
import { seed } from "../../utils/seed";
import { prisma } from "../../../src/prisma";
import { ApproveSolicitationUseCase } from "../../../src/useCases/cashback/ApproveSolicitationUseCase";
import { SolicitationStatus, SolicitationType } from "@prisma/client";

test.group("Solicitation", (group) => {
  group.deleteTables();

  test("it should be able to approve a solicitation ({$self})")
    .with([SolicitationType.CASHBACK, SolicitationType.PAYMENT])
    .run(async ({ assert }, type) => {
      const {
        moneyPaymentMethod,
        consumer,
        company,
        pendingTransactionStatus,
        companyUser,
      } = await seed();

      const useCase = new ApproveSolicitationUseCase();

      const data = {
        companyId: company.id,
        companyPaymentMethodId: moneyPaymentMethod.id,
        consumerId: consumer.id,
        valueInCents: 1534,
        type,
      };

      const solicitation = await prisma.transactionSolicitation.create({
        data,
      });

      const transaction = await useCase.execute(solicitation, companyUser.id);

      assert.exists(transaction.id);

      const updatedSolicitation =
        await prisma.transactionSolicitation.findUniqueOrThrow({
          where: { id: solicitation.id },
        });

      assert.equal(updatedSolicitation.status, SolicitationStatus.APPROVED);
      assert.equal(updatedSolicitation.companyUserId, companyUser.id);
      assert.isNotNull(updatedSolicitation.updatedAt);

      assert.equal(
        transaction.transactionStatusId,
        pendingTransactionStatus.id
      );
      assert.equal(+transaction.totalAmount, data.valueInCents / 100);
      assert.equal(
        +transaction.amountPayWithOthersMethods,
        data.valueInCents / 100
      );

      assert.equal(transaction.companyUsersId, companyUser.id);

      const consumerUpdated = await prisma.consumer.findUnique({
        where: {
          id: consumer.id,
        },
      });

      const companyUpdated = await prisma.company.findUnique({
        where: {
          id: company.id,
        },
      });

      assert.equal(
        +consumerUpdated.balance,
        +consumer.balance - +transaction.amountPayWithTakebackBalance
      );

      assert.approximately(
        +consumerUpdated.blockedBalance,
        +consumer.blockedBalance +
          +transaction.cashbackAmount +
          +transaction.backAmount,
        0.01
      );

      assert.equal(
        +companyUpdated.positiveBalance,
        +company.positiveBalance + +transaction.amountPayWithTakebackBalance
      );

      assert.approximately(
        +companyUpdated.negativeBalance,
        +company.negativeBalance +
          +transaction.cashbackAmount +
          +transaction.takebackFeeAmount +
          +transaction.backAmount,
        0.01
      );
    });
});
