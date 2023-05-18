import { test } from "@japa/runner";
import { prisma } from "../../../src/prisma";
import { seed } from "../../utils/seed";
import { generateData } from "./utils/generate-cashback-data";
import { CashRegisterUseCase } from "../../../src/useCases/cashback/CashRegisterUseCase";

test.group("Generate Cashback", (group) => {
  group.deleteTables();

  test("it should be able to generate a cashback without takeback method", async ({
    assert,
  }) => {
    const seedData = await seed();

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

    const transactions = await prisma.transaction.findMany();

    assert.lengthOf(transactions, 1);

    const transaction = transactions[0];

    assert.isNotNull(transaction.companyUsersId);
    assert.equal(
      transaction.transactionStatusId,
      seedData.pendingTransactionStatus.id
    );
    assert.equal(transaction.totalAmount, 100);
    assert.equal(transaction.amountPayWithOthersMethods, 100);
    assert.equal(transaction.amountPayWithTakebackBalance, 0);
    assert.equal(transaction.takebackFeePercent, 0.01);
    assert.equal(transaction.takebackFeeAmount, 1);
    assert.equal(transaction.cashbackPercent, 0.013);
    assert.equal(transaction.cashbackAmount, 1.3);

    const { consumer, company } = seedData;

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
      +consumerUpdated.blockedBalance,
      +consumer.blockedBalance + +transaction.cashbackAmount
    );

    assert.equal(
      +companyUpdated.negativeBalance,
      +company.negativeBalance +
        +transaction.cashbackAmount +
        +transaction.takebackFeeAmount
    );
  });

  test("it should be able to generate a cashback without takeback method and with customIndustryFee", async ({
    assert,
  }) => {
    const seedData = await seed();

    const data = generateData({
      seedData,
      totalValue: 100,
      methods: [
        [seedData.moneyPaymentMethod.id, 50],
        [seedData.creditPaymentMethod.id, 50],
      ],
    });

    await prisma.company.update({
      where: {
        id: seedData.company.id,
      },
      data: {
        customIndustryFee: 0.05,
        customIndustryFeeActive: true,
      },
    });

    const useCase = new CashRegisterUseCase();

    await useCase.execute(data);

    const transactions = await prisma.transaction.findMany();

    assert.lengthOf(transactions, 1);

    const transaction = transactions[0];

    assert.equal(transaction.takebackFeePercent, 0.05);
    assert.equal(transaction.takebackFeeAmount, 5);
  });

  test("it should be able to generate a cashback with only takeback method", async ({
    assert,
  }) => {
    const seedData = await seed();

    const data = generateData({
      seedData,
      totalValue: 2,
      methods: [[seedData.takebackPaymentMethod.id, 2]],
    });

    const useCase = new CashRegisterUseCase();

    await useCase.execute(data);

    const transactions = await prisma.transaction.findMany();

    assert.lengthOf(transactions, 1);

    const transaction = transactions[0];

    assert.isNotNull(transaction.companyUsersId);
    assert.equal(
      transaction.transactionStatusId,
      seedData.paidWithTakebackTransactionStatus.id
    );
    assert.equal(transaction.totalAmount, 2);
    assert.equal(transaction.amountPayWithOthersMethods, 0);
    assert.equal(transaction.amountPayWithTakebackBalance, 2);
    assert.equal(transaction.takebackFeePercent, 0.01);
    assert.equal(transaction.takebackFeeAmount, 0);
    assert.equal(transaction.cashbackPercent, 0);
    assert.equal(transaction.cashbackAmount, 0);

    const { consumer, company } = seedData;

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

    assert.equal(
      +companyUpdated.positiveBalance,
      +company.positiveBalance + +transaction.amountPayWithTakebackBalance
    );
  });

  test("it should be able to generate a cashback with takeback method", async ({
    assert,
  }) => {
    const seedData = await seed();

    const data = generateData({
      seedData,
      totalValue: 12,
      methods: [
        [seedData.takebackPaymentMethod.id, 2],
        [seedData.moneyPaymentMethod.id, 10],
      ],
    });

    const useCase = new CashRegisterUseCase();

    await useCase.execute(data);

    const transactions = await prisma.transaction.findMany();

    assert.lengthOf(transactions, 1);

    const transaction = transactions[0];

    assert.isNotNull(transaction.companyUsersId);
    assert.equal(
      transaction.transactionStatusId,
      seedData.pendingTransactionStatus.id
    );
    assert.equal(transaction.totalAmount, 12);
    assert.equal(transaction.amountPayWithOthersMethods, 10);
    assert.equal(transaction.amountPayWithTakebackBalance, 2);
    assert.equal(transaction.takebackFeePercent, 0.01);
    assert.equal(transaction.takebackFeeAmount, 0.1);
    assert.equal(transaction.cashbackPercent, 0.02);
    assert.equal(transaction.cashbackAmount, 0.2);
  });

  test("it should be able to generate a cashback with backValue", async ({
    assert,
  }) => {
    const seedData = await seed();

    const data = generateData({
      seedData,
      backValue: 4.5,
      totalValue: 95.5,
      methods: [[seedData.moneyPaymentMethod.id, 100]],
    });

    const useCase = new CashRegisterUseCase();

    await useCase.execute(data);

    const transactions = await prisma.transaction.findMany();

    assert.lengthOf(transactions, 1);

    const transaction = transactions[0];

    assert.isNotNull(transaction.companyUsersId);
    assert.equal(
      transaction.transactionStatusId,
      seedData.pendingTransactionStatus.id
    );
    assert.equal(transaction.totalAmount, 95.5);
    assert.equal(transaction.amountPayWithOthersMethods, 95.5);
    assert.equal(transaction.amountPayWithTakebackBalance, 0);
    assert.equal(transaction.takebackFeePercent, 0.01);
    assert.equal(transaction.takebackFeeAmount, 0.96);
    assert.equal(transaction.cashbackPercent, 0.02);
    assert.equal(transaction.cashbackAmount, 1.91);
    assert.equal(transaction.backAmount, 4.5);
  });

  test("it should be able to generate a cashback with multiple paymentMethods takeback method and backValue", async ({
    assert,
  }) => {
    const seedData = await seed();

    const data = generateData({
      seedData,
      totalValue: 95.5,
      backValue: 4.5,
      methods: [
        [seedData.moneyPaymentMethod.id, 70],
        [seedData.creditPaymentMethod.id, 20],
        [seedData.takebackPaymentMethod.id, 10],
      ],
    });

    const useCase = new CashRegisterUseCase();

    await useCase.execute(data);

    const transactions = await prisma.transaction.findMany();

    assert.lengthOf(transactions, 1);

    const transaction = transactions[0];

    assert.isNotNull(transaction.companyUsersId);
    assert.equal(
      transaction.transactionStatusId,
      seedData.pendingTransactionStatus.id
    );
    assert.equal(transaction.totalAmount, 95.5);
    assert.equal(transaction.amountPayWithOthersMethods, 85.5);
    assert.equal(transaction.amountPayWithTakebackBalance, 10);
    assert.equal(transaction.takebackFeePercent, 0.01);
    assert.equal(transaction.takebackFeeAmount, 0.86);
    assert.equal(transaction.cashbackPercent, 0.0177);
    assert.equal(transaction.cashbackAmount, 1.51);
    assert.equal(transaction.backAmount, 4.5);

    const {
      consumer,
      company,
      takebackPaymentMethod,
      creditPaymentMethod,
      moneyPaymentMethod,
    } = seedData;

    const [
      takebackTransactionPaymentMethod,
      moneyTransactionPaymentMethod,
      creditTransactionPaymentMethod,
    ] = await prisma.transactionPaymentMethod.findMany({
      where: {
        transactionsId: transaction.id,
      },
    });

    assert.equal(
      creditTransactionPaymentMethod.paymentMethodId,
      creditPaymentMethod.paymentMethodId
    );

    assert.equal(
      +creditTransactionPaymentMethod.cashbackPercentage,
      +creditPaymentMethod.cashbackPercentage
    );

    assert.equal(creditTransactionPaymentMethod.cashbackValue, 0.2);

    assert.equal(
      moneyTransactionPaymentMethod.paymentMethodId,
      moneyPaymentMethod.paymentMethodId
    );

    assert.equal(
      +moneyTransactionPaymentMethod.cashbackPercentage,
      +moneyPaymentMethod.cashbackPercentage
    );

    assert.equal(moneyTransactionPaymentMethod.cashbackValue, 1.31);

    assert.equal(
      takebackTransactionPaymentMethod.paymentMethodId,
      takebackPaymentMethod.paymentMethodId
    );

    assert.equal(
      +takebackTransactionPaymentMethod.cashbackPercentage,
      +takebackPaymentMethod.cashbackPercentage
    );

    assert.equal(takebackTransactionPaymentMethod.cashbackValue, 0);

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
