import {
  Company,
  CompanyPaymentMethod,
  CompanyUser,
  Consumer,
  Industry,
} from "@prisma/client";
import { prisma } from "../../src/prisma";
import bcrypt from "bcrypt";

export enum PaymentMethods {
  Takeback = "Takeback",
  Dinheiro = "Dinheiro",
  Credito = "Cartão de Crédito",
}

export type SeedData = {
  industry: Industry;
  company: Company;
  takebackPaymentMethod: CompanyPaymentMethod;
  creditPaymentMethod: CompanyPaymentMethod;
  moneyPaymentMethod: CompanyPaymentMethod;
  companyUserPassword: string;
  consumer: Consumer;
  companyUser: CompanyUser;
};

export async function seed() {
  const industry = await prisma.industry.create({
    data: {
      description: "Outro",
      industryFee: 0.01,
    },
  });

  const defaultPaymentPlan = await prisma.paymentPlan.create({
    data: {
      description: "Padrão",
      takebackBonus: 0.1,
    },
  });

  const company = await prisma.company.create({
    data: {
      corporateName: "Bruno LTDA",
      email: "test@test.com",
      fantasyName: "Bruno Company",
      phone: "11111111",
      contactPhone: "11111111",
      registeredNumber: "63076659000141",
      industryId: industry.id,
      positiveBalance: 100,
      negativeBalance: 100,
      useCashbackAsBack: true,
      paymentPlanId: defaultPaymentPlan.id,
    },
  });

  await prisma.companyAddress.create({
    data: {
      company: { connect: { id: company.id } },
      city: {
        create: {
          ibgeCode: "1",
          name: "Cidade A",
        },
      },
    },
  });

  const companyUserPassword = "password";

  const companyUser = await prisma.companyUser.create({
    data: {
      companyId: company.id,
      name: "Caixa",
      password: await bcrypt.hash(companyUserPassword, 10),
      cpf: "14077950661",
    },
  });

  const consumer = await prisma.consumer.create({
    data: {
      cpf: "14077950660",
      email: "test@test.com",
      fullName: "John Doe",
      password: await bcrypt.hash("password", 10),
      balance: 100,
      blockedBalance: 30,
    },
  });

  const takebackPaymentMethod = await prisma.companyPaymentMethod.create({
    data: {
      company: {
        connect: { id: company.id },
      },
      paymentMethod: {
        create: {
          description: PaymentMethods.Takeback,
          isTakebackMethod: true,
        },
      },
      cashbackPercentage: 0,
      isActive: true,
    },
  });

  const moneyPaymentMethod = await prisma.companyPaymentMethod.create({
    data: {
      company: {
        connect: { id: company.id },
      },
      paymentMethod: {
        create: {
          description: PaymentMethods.Dinheiro,
        },
      },
      cashbackPercentage: 0.02,
      isActive: true,
    },
  });

  const creditPaymentMethod = await prisma.companyPaymentMethod.create({
    data: {
      company: {
        connect: { id: company.id },
      },
      paymentMethod: {
        create: {
          description: PaymentMethods.Credito,
        },
      },
      cashbackPercentage: 0.01,
      isActive: true,
    },
  });

  const waitingTransactionStatus = await prisma.transactionStatus.create({
    data: {
      description: "Aguardando",
    },
  });

  const approvedTransactionStatus = await prisma.transactionStatus.create({
    data: {
      description: "Aprovada",
    },
  });

  const canceledByPartnerTransactionStatus =
    await prisma.transactionStatus.create({
      data: {
        description: "Cancelada pelo parceiro",
      },
    });

  const pendingTransactionStatus = await prisma.transactionStatus.create({
    data: {
      description: "Pendente",
    },
  });

  const paidWithTakebackTransactionStatus =
    await prisma.transactionStatus.create({
      data: {
        description: "Pago com takeback",
      },
    });

  return {
    industry,
    company,
    takebackPaymentMethod,
    creditPaymentMethod,
    moneyPaymentMethod,
    companyUserPassword,
    consumer,
    companyUser,
    waitingTransactionStatus,
    pendingTransactionStatus,
    paidWithTakebackTransactionStatus,
    canceledByPartnerTransactionStatus,
    approvedTransactionStatus,
  };
}
