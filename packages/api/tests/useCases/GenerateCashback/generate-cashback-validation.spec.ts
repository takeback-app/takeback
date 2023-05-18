import { test } from "@japa/runner";
import { seed } from "../../utils/seed";
import { generateData } from "./utils/generate-cashback-data";
import { prisma } from "../../../src/prisma";
import { CashRegisterUseCase } from "../../../src/useCases/cashback/CashRegisterUseCase";

test.group("Generate Cashback", (group) => {
  group.deleteTables();

  test("it should not be able to generate cashback to a non existent consumer", async ({
    assert,
  }) => {
    assert.plan(2);

    const seedData = await seed();

    const data = generateData({
      seedData,
      totalValue: 1,
      methods: [[seedData.moneyPaymentMethod.id, 1]],
    });

    data.cpf = "invalid";

    const useCase = new CashRegisterUseCase();

    try {
      await useCase.execute(data);
    } catch (e) {
      assert.include(e.message, "CPF inválido");
    }

    const transactions = await prisma.transaction.findMany();

    assert.lengthOf(transactions, 0);
  });

  test("it should not be able to generate cashback to a inactive consumer", async ({
    assert,
  }) => {
    assert.plan(2);

    const seedData = await seed();

    const data = generateData({
      seedData,
      totalValue: 1,
      methods: [[seedData.moneyPaymentMethod.id, 1]],
    });

    await prisma.consumer.update({
      where: { id: seedData.consumer.id },
      data: {
        deactivatedAccount: true,
      },
    });

    const useCase = new CashRegisterUseCase();

    try {
      await useCase.execute(data);
    } catch (e) {
      assert.include(e.message, "não está ativo");
    }

    const transactions = await prisma.transaction.findMany();

    assert.lengthOf(transactions, 0);
  });

  test("it should not be able to generate cashback with duplicated payment methods", async ({
    assert,
  }) => {
    assert.plan(2);

    const seedData = await seed();

    const data = generateData({
      seedData,
      totalValue: 2,
      methods: [
        [seedData.moneyPaymentMethod.id, 1],
        [seedData.moneyPaymentMethod.id, 1],
      ],
    });

    const useCase = new CashRegisterUseCase();

    try {
      await useCase.execute(data);
    } catch (e) {
      assert.include(e.message, "duplicados");
    }

    const transactions = await prisma.transaction.findMany();

    assert.lengthOf(transactions, 0);
  });

  test("it should not be able to generate cashback with backValue on company without that option", async ({
    assert,
  }) => {
    assert.plan(2);

    const seedData = await seed();

    const data = generateData({
      seedData,
      totalValue: 1,
      backValue: 1,
      methods: [[seedData.moneyPaymentMethod.id, 2]],
    });

    await prisma.company.update({
      where: { id: seedData.company.id },
      data: {
        useCashbackAsBack: false,
      },
    });

    const useCase = new CashRegisterUseCase();

    try {
      await useCase.execute(data);
    } catch (e) {
      assert.include(e.message, "Opção de troco como cashback não disponível");
    }

    const transactions = await prisma.transaction.findMany();

    assert.lengthOf(transactions, 0);
  });

  test("it should not be able to generate cashback with backValue without money payment method", async ({
    assert,
  }) => {
    assert.plan(2);

    const seedData = await seed();

    const data = generateData({
      seedData,
      totalValue: 1,
      backValue: 1,
      methods: [[seedData.creditPaymentMethod.id, 2]],
    });

    const useCase = new CashRegisterUseCase();

    try {
      await useCase.execute(data);
    } catch (e) {
      assert.include(
        e.message,
        "Só é possível dar troco como cashback com o método de pagamento dinheiro"
      );
    }

    const transactions = await prisma.transaction.findMany();

    assert.lengthOf(transactions, 0);
  });

  test("it should not be able to generate cashback with backValue when sum dont check", async ({
    assert,
  }) => {
    assert.plan(2);

    const seedData = await seed();

    const data = generateData({
      seedData,
      totalValue: 2,
      backValue: 3,
      methods: [[seedData.moneyPaymentMethod.id, 1]],
    });

    const useCase = new CashRegisterUseCase();

    try {
      await useCase.execute(data);
    } catch (e) {
      assert.include(e.message, "A soma dos items está incorreta");
    }

    const transactions = await prisma.transaction.findMany();

    assert.lengthOf(transactions, 0);
  });
});
