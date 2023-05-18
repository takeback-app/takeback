import { test } from "@japa/runner";
import { prisma } from "../../../src/prisma";
import { seed } from "../../utils/seed";
import { GenerateSellBonus } from "../../../src/useCases/consumer/bonus/GenerateSellBonus";

test.group("Bonus", (group) => {
  group.deleteTables();

  test("it should be able to generate sell bonus", async ({ assert }) => {
    const seedData = await seed();

    const { company, consumer, companyUser } = seedData;

    await prisma.consumer.update({
      where: { id: consumer.id },
      data: { cpf: companyUser.cpf },
    });

    const takebackFeeAmount = 1.62;

    const originalTransaction = await prisma.transaction.create({
      data: {
        takebackFeeAmount,
        companyUsersId: companyUser.id,
        companiesId: company.id,
        transactionStatusId: seedData.approvedTransactionStatus.id,
      },
    });

    const sellBonus = new GenerateSellBonus();

    const bonus = await sellBonus.create(originalTransaction.id);

    assert.closeTo(+bonus.value, takebackFeeAmount * 0.1, 0.005);

    const consumerUpdated = await prisma.consumer.findUnique({
      where: {
        id: consumer.id,
      },
    });

    assert.equal(+consumerUpdated.balance, +consumer.balance + +bonus.value);
  });
});
