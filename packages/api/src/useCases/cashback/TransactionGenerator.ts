import {
  PaymentMethod,
  CompanyPaymentMethod as PrismaCompanyPaymentMethod,
  Prisma,
  Company as PrismaCompany,
} from "@prisma/client";
import { InternalError } from "../../config/GenerateErros";

interface MethodData {
  id: number;
  value: number;
}

type CompanyPaymentMethod = PrismaCompanyPaymentMethod & {
  paymentMethod: PaymentMethod;
};

type Company = PrismaCompany & {
  industry: {
    industryFee: Prisma.Decimal;
  };
};

type TransactionPaymentMethodData = {
  paymentMethodId: number;
  cashbackPercentage: number;
  cashbackValue: number;
};

const MONEY_PAYMENT_METHOD_DESCRIPTION = "Dinheiro";

export class TransactionGenerator {
  protected amountPayWithOthersMethods = 0;
  protected amountPayWithTakebackBalance = 0;

  protected transactionPaymentMethodsData: TransactionPaymentMethodData[] = [];

  protected cashbackAmount = 0;
  protected cashbackPercent = 0;

  protected takebackFeeAmount = 0;
  protected takebackFeePercent = 0;

  constructor(protected companyPaymentMethods: CompanyPaymentMethod[]) {}

  calculateCashback(methodsData: MethodData[], changeAmount: number = 0) {
    let hasMoneyPaymentMethod = false;

    this.transactionPaymentMethodsData = this.companyPaymentMethods.map((c) => {
      let { value: payment } = methodsData.find((i) => i.id == c.id);

      if (c.paymentMethod.description === MONEY_PAYMENT_METHOD_DESCRIPTION) {
        hasMoneyPaymentMethod = true;
        payment -= changeAmount;
      }

      return this._calculateTransactionPaymentMethodData(c, payment);
    });

    if (!hasMoneyPaymentMethod && !!changeAmount) {
      throw new InternalError(
        "Só é possível dar troco como cashback com o método de pagamento dinheiro",
        400
      );
    }

    return this;
  }

  calculateFee(company: Company) {
    this.takebackFeePercent = company.customIndustryFeeActive
      ? company.customIndustryFee.toNumber()
      : company.industry.industryFee.toNumber();

    this.takebackFeeAmount =
      this.takebackFeePercent * this.amountPayWithOthersMethods;

    return this;
  }

  hasTakebackPaymentMethod() {
    return !!this.companyPaymentMethods.find(
      (c) => c.paymentMethod.isTakebackMethod
    );
  }

  getData() {
    this.cashbackPercent =
      this.cashbackAmount / (this.amountPayWithOthersMethods || 1); // Avoid division by zero

    return {
      amountPayWithOthersMethods: this.roundToMoney(
        this.amountPayWithOthersMethods
      ),
      amountPayWithTakebackBalance: this.roundToMoney(
        this.amountPayWithTakebackBalance
      ),

      cashbackAmount: this.roundToMoney(this.cashbackAmount),
      cashbackPercent: this.cashbackPercent,

      takebackFeeAmount: this.roundToMoney(this.takebackFeeAmount),
      takebackFeePercent: this.takebackFeePercent,
    };
  }

  getTransactionPaymentMethodsData() {
    return this.transactionPaymentMethodsData;
  }

  private _calculateTransactionPaymentMethodData(
    c: CompanyPaymentMethod,
    payment: number
  ) {
    const { cashbackPercentage, id, paymentMethod } = c;

    if (paymentMethod.isTakebackMethod) {
      this.amountPayWithTakebackBalance = payment;

      return {
        cashbackPercentage: 0,
        cashbackValue: 0,
        paymentMethodId: id,
      };
    }

    const cashbackValue = cashbackPercentage.toNumber() * payment;

    this.amountPayWithOthersMethods += payment;
    this.cashbackAmount += cashbackValue;

    return {
      paymentMethodId: id,
      cashbackPercentage: cashbackPercentage.toNumber(),
      cashbackValue,
    };
  }

  private roundToMoney(number: number) {
    return Math.round(number * 100) / 100;
  }
}
