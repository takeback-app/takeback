import { test } from "@japa/runner";
import { prisma } from "../../../src/prisma";
import { seed } from "../../utils/seed";
import { generateData } from "./utils/generate-cashback-data";
import { CashRegisterUseCase } from "../../../src/useCases/cashback/CashRegisterUseCase";

test.group("Generate Cashback", (group) => {
  group.deleteTables();

  test("it should be able to generate a placeholder consumer", async ({
    assert,
  }) => {
    const seedData = await seed();

    const newConsumerCpf = "34914648202";

    seedData.consumer.cpf = newConsumerCpf;

    const data = generateData({
      seedData,
      totalValue: 100,

      methods: [
        [seedData.moneyPaymentMethod.id, 30],
        [seedData.creditPaymentMethod.id, 70],
      ],
    });

    const useCase = new CashRegisterUseCase();

    await useCase.execute(data);

    const newConsumer = await prisma.consumer.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    assert.equal(newConsumer.cpf, newConsumerCpf);

    const transactions = await prisma.transaction.findMany();

    assert.lengthOf(transactions, 1);

    const transaction = transactions[0];

    assert.equal(transaction.consumersId, newConsumer.id);
  });
});
