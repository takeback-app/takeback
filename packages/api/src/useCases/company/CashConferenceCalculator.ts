import { CompanyUser, Transaction as PrismaTransaction } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";

export interface Data {
  totalAmount: number;
  users: Array<{
    id: string;
    name: string;
    paymentMethods: Array<{
      description: string;
      value: number;
    }>;
  }>;
}

type TransactionPaymentMethod = {
  cashbackValue: Decimal;
  amount: Decimal;
  cashbackPercentage: Decimal;
  companyPaymentMethod: {
    paymentMethod: {
      description: string;
    };
  };
};

type Transaction = PrismaTransaction & {
  transactionPaymentMethods: TransactionPaymentMethod[];
};

export class CashConferenceCalculator {
  protected data: Data;

  constructor(protected companyUsers: CompanyUser[]) {
    this.data = {
      totalAmount: 0,
      users: [],
    };
  }

  public static make(companyUsers: CompanyUser[]) {
    return new CashConferenceCalculator(companyUsers);
  }

  public calculate(transactions: Partial<Transaction>[]) {
    for (const transaction of transactions) {
      const userIndex = this.findOrCreateUserIndex(transaction);

      this.updateUserPaymentMethods(userIndex, transaction);
    }

    return this;
  }

  protected updateUserPaymentMethods(
    userIndex: number,
    transaction: Partial<Transaction>
  ) {
    for (const transactionPaymentMethod of transaction.transactionPaymentMethods) {
      const paymentMethodIndex = this.findOrCreatePaymentMethod(
        userIndex,
        transactionPaymentMethod
      );

      const amount = +transactionPaymentMethod.amount;

      this.data.totalAmount += amount;

      this.data.users[userIndex].paymentMethods[paymentMethodIndex].value +=
        amount;
    }
  }

  public getData() {
    return this.data;
  }

  private findOrCreateUserIndex(transaction: Partial<Transaction>) {
    const userIndex = this.data.users.findIndex(
      ({ id }) => id === transaction.companyUsersId
    );

    if (userIndex !== -1) return userIndex;

    const { id, name } = this.companyUsers.find(
      (u) => u.id === transaction.companyUsersId
    );

    const newLength = this.data.users.push({
      id,
      name,
      paymentMethods: [],
    });

    return newLength - 1;
  }

  private findOrCreatePaymentMethod(
    userIndex: number,
    transactionPaymentMethod: TransactionPaymentMethod
  ) {
    const description =
      transactionPaymentMethod.companyPaymentMethod.paymentMethod.description;

    const paymentMethodIndex = this.data.users[
      userIndex
    ].paymentMethods.findIndex((p) => p.description === description);

    if (paymentMethodIndex !== -1) return paymentMethodIndex;

    const newLength = this.data.users[userIndex].paymentMethods.push({
      description,
      value: 0,
    });

    return newLength - 1;
  }
}
