import { test } from "@japa/runner";
import { SolicitationUseCase } from "../../../src/useCases/cashback/CreateSolicitationUseCase";
import { seed } from "../../utils/seed";
import { prisma } from "../../../src/prisma";

test.group("Solicitation", (group) => {
  group.deleteTables();

  test("it should be able to create a solicitation of cashback", async ({
    assert,
  }) => {
    const { moneyPaymentMethod, consumer, company } = await seed();

    const useCase = new SolicitationUseCase();

    const solicitation = await useCase.createCashback({
      companyId: company.id,
      companyPaymentMethodId: moneyPaymentMethod.id,
      consumerId: consumer.id,
      valueInCents: 1000,
    });

    assert.isNotNull(solicitation);
    assert.exists(solicitation.id);
  });

  test("it not should be able to create two solicitation of cashback in 15 minutes", async ({
    assert,
  }) => {
    assert.plan(2);
    const { moneyPaymentMethod, consumer, company } = await seed();

    const useCase = new SolicitationUseCase();

    const data = {
      companyId: company.id,
      companyPaymentMethodId: moneyPaymentMethod.id,
      consumerId: consumer.id,
      valueInCents: 20000,
    };

    await useCase.createCashback(data);

    try {
      await useCase.createCashback(data);
    } catch (e) {
      assert.include(e.message, "Aguarde um momento");
    }

    const count = await prisma.transactionSolicitation.count();

    assert.equal(count, 1);
  });

  test("it should be able to create a solicitation of payment many times", async ({
    assert,
  }) => {
    const { moneyPaymentMethod, consumer, company } = await seed();

    const useCase = new SolicitationUseCase();

    const data = {
      companyId: company.id,
      companyPaymentMethodId: moneyPaymentMethod.id,
      consumerId: consumer.id,
      valueInCents: 1000,
    };

    await useCase.createPayment(data);

    await useCase.createPayment(data);

    const count = await prisma.transactionSolicitation.count();

    assert.equal(count, 2);
  });

  test("it should not be able to create a solicitation of payment greater then costumer balance", async ({
    assert,
  }) => {
    const { moneyPaymentMethod, consumer, company } = await seed();

    const useCase = new SolicitationUseCase();

    const data = {
      companyId: company.id,
      companyPaymentMethodId: moneyPaymentMethod.id,
      consumerId: consumer.id,
      valueInCents: 7500, // R$75,00
    };

    await useCase.createPayment(data);

    try {
      await useCase.createPayment(data);
    } catch (e) {
      assert.include(e.message, "Saldo");
    }

    const count = await prisma.transactionSolicitation.count();

    assert.equal(count, 1);
  });
});
