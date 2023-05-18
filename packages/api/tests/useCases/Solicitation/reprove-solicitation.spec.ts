import { test } from "@japa/runner";
import { SolicitationStatus, SolicitationType } from "@prisma/client";

import { seed } from "../../utils/seed";
import { prisma } from "../../../src/prisma";
import { ReproveSolicitationUseCase } from "../../../src/useCases/cashback/ReproveSolicitationUseCase";

test.group("Solicitation", (group) => {
  group.deleteTables();

  test("it should be able to reprove a solicitation ({$self})")
    .with([SolicitationType.CASHBACK, SolicitationType.PAYMENT])
    .run(async ({ assert }, type) => {
      const { moneyPaymentMethod, consumer, company, companyUser } =
        await seed();

      const useCase = new ReproveSolicitationUseCase();

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

      await useCase.execute({
        solicitationId: solicitation.id,
        companyUserId: companyUser.id,
        reason: "Error",
      });

      const count = await prisma.transaction.count();

      assert.equal(count, 0);

      const updatedSolicitation =
        await prisma.transactionSolicitation.findUniqueOrThrow({
          where: { id: solicitation.id },
        });

      assert.equal(updatedSolicitation.status, SolicitationStatus.CANCELED);
      assert.equal(updatedSolicitation.companyUserId, companyUser.id);
      assert.isNotNull(updatedSolicitation.updatedAt);
      assert.isNotNull(updatedSolicitation.text);

      const consumerUpdated = await prisma.consumer.findUnique({
        where: { id: consumer.id },
      });

      const companyUpdated = await prisma.company.findUnique({
        where: { id: company.id },
      });

      assert.equal(+consumerUpdated.balance, +consumer.balance);

      assert.equal(+consumerUpdated.blockedBalance, +consumer.blockedBalance);

      assert.equal(+companyUpdated.positiveBalance, +company.positiveBalance);

      assert.equal(+companyUpdated.negativeBalance, +company.negativeBalance);
    });
});
