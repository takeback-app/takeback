CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "city" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "ibgeCode" VARCHAR NOT NULL,
    "stateId" INTEGER,
    CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "corporateName" VARCHAR NOT NULL,
    "fantasyName" VARCHAR NOT NULL,
    "registeredNumber" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "customIndustryFee" DECIMAL(10, 4) NOT NULL DEFAULT 0,
    "customIndustryFeeActive" BOOLEAN NOT NULL DEFAULT false,
    "positiveBalance" DECIMAL(10, 4) NOT NULL DEFAULT 0,
    "negativeBalance" DECIMAL(10, 4) NOT NULL DEFAULT 0,
    "monthlyPayment" DECIMAL(10, 4) NOT NULL DEFAULT 0,
    "customMonthlyPayment" BOOLEAN NOT NULL DEFAULT false,
    "currentMonthlyPaymentPaid" BOOLEAN NOT NULL DEFAULT false,
    "firstAccessAllowedAt" DATE,
    "provisionalAccessAllowedAt" DATE,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addressId" INTEGER,
    "industryId" INTEGER,
    "statusId" INTEGER,
    "paymentPlanId" INTEGER,
    "periodFree" BOOLEAN NOT NULL DEFAULT true,
    "permissionToSupportAccess" BOOLEAN NOT NULL DEFAULT false,
    "representativeId" UUID,
    "useCashbackAsBack" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies_address" (
    "id" SERIAL NOT NULL,
    "street" VARCHAR,
    "district" VARCHAR,
    "number" VARCHAR,
    "complement" VARCHAR,
    "cityId" INTEGER,
    "zipCode" VARCHAR,
    CONSTRAINT "PK_ad150e1e829fc0c9013267f3e4c" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_monthly_payment" (
    "id" SERIAL NOT NULL,
    "amountPaid" DECIMAL(10, 4) DEFAULT 0,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidDate" DATE,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" UUID,
    "planId" INTEGER,
    "dueDate" DATE,
    "isForgiven" BOOLEAN NOT NULL DEFAULT false,
    "paymentMade" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "PK_af89d91c5401f744b667ce3b544" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_payment_methods" (
    "id" SERIAL NOT NULL,
    "companyId" UUID NOT NULL,
    "paymentMethodId" INTEGER NOT NULL,
    "cashbackPercentage" DECIMAL(10, 4) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_7f9233e77d51ef422b9c7430f6a" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_status" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR NOT NULL,
    "blocked" BOOLEAN NOT NULL,
    "generateCashback" BOOLEAN NOT NULL,
    CONSTRAINT "PK_0004a562592abd6cb0828df61eb" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_user_types" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR NOT NULL,
    "isManager" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "PK_a41da118d3354bf30d1a2fa5c57" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "isRootUser" BOOLEAN NOT NULL DEFAULT false,
    "password" VARCHAR,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" UUID,
    "companyUserTypesId" INTEGER,
    "email" VARCHAR,
    "resetPasswordToken" VARCHAR,
    "resetPasswordTokenExpiresDate" DATE,
    "cpf" VARCHAR,
    CONSTRAINT "PK_fcd31773e604355d8a473de888c" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consumer_address" (
    "id" SERIAL NOT NULL,
    "street" VARCHAR,
    "district" VARCHAR,
    "number" VARCHAR,
    "complement" VARCHAR,
    "cityId" INTEGER,
    "zipCode" VARCHAR,
    CONSTRAINT "PK_c0e86059b3acb674fa2496704d3" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consumers" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fullName" VARCHAR NOT NULL,
    "birthDate" TIMESTAMP(6),
    "phone" VARCHAR,
    "email" VARCHAR NOT NULL,
    "cpf" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "signature" VARCHAR,
    "signatureRegistered" BOOLEAN NOT NULL DEFAULT false,
    "balance" DECIMAL(10, 4) NOT NULL DEFAULT 0,
    "blockedBalance" DECIMAL(10, 4) NOT NULL DEFAULT 0,
    "emailConfirmated" BOOLEAN NOT NULL DEFAULT false,
    "phoneConfirmated" BOOLEAN NOT NULL DEFAULT false,
    "codeToConfirmEmail" VARCHAR,
    "deactivedAccount" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addressId" INTEGER,
    "resetPasswordToken" VARCHAR,
    "resetPasswordTokenExpiresDate" DATE,
    CONSTRAINT "PK_9355367764efa60a8c2c27856d0" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industries" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR NOT NULL,
    "industryFee" DECIMAL(10, 4) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_f1626dcb2d58142d7dfcca7b8d1" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR NOT NULL,
    "isTakebackMethod" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_order" (
    "id" SERIAL NOT NULL,
    "value" DECIMAL(10, 4) NOT NULL DEFAULT 0,
    "ticketName" VARCHAR,
    "ticketPath" VARCHAR,
    "pixKey" VARCHAR,
    "approvedAt" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusId" INTEGER,
    "companyId" UUID,
    "paymentMethodId" INTEGER,
    CONSTRAINT "PK_f5221735ace059250daac9d9803" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_order_methods" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN DEFAULT true,
    CONSTRAINT "PK_3c92b201828721875e5fca5c6fc" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_order_status" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR NOT NULL,
    CONSTRAINT "PK_7e518a8c66fd35e7cb7b97ffb21" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_plans" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR NOT NULL,
    "value" DECIMAL(10, 4) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_8f05aee900e96c2e0c24df48262" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "expiresIn" INTEGER NOT NULL,
    "consumerId" UUID,
    CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "representative" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "cpf" VARCHAR NOT NULL,
    "phone" VARCHAR,
    "email" VARCHAR,
    "whatsapp" VARCHAR,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "gainPercentage" DECIMAL(10, 4) NOT NULL DEFAULT 0,
    "password" VARCHAR,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "balance" DECIMAL(10, 4) NOT NULL DEFAULT 0,
    CONSTRAINT "PK_2abe568eacaba9eba605bb231bc" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "representative_billing" (
    "id" SERIAL NOT NULL,
    "billingValue" DECIMAL(10, 4) NOT NULL DEFAULT 0,
    "totalCompaniesBilling" DECIMAL(10, 4) NOT NULL DEFAULT 0,
    "representativeFee" DECIMAL(10, 4) NOT NULL DEFAULT 0,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidDate" DATE,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "representativeId" UUID,
    CONSTRAINT "PK_3cd53441fab137fcfe0f7205f2c" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "representative_billing_company" (
    "id" SERIAL NOT NULL,
    "companyBilling" DECIMAL(10, 4) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "representativeBillingId" INTEGER,
    "companyId" UUID,
    CONSTRAINT "PK_4207fb14ded7e2ede45b8e1e504" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "representative_refresh_tokens" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "expiresIn" INTEGER NOT NULL,
    "representativeId" UUID,
    CONSTRAINT "PK_a575bc1c9d1d1bc490618296f74" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payDate" INTEGER NOT NULL,
    "provisionalAccessDays" INTEGER,
    "takebackPixKey" VARCHAR,
    "takebackQRCode" VARCHAR,
    CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "state" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "initials" VARCHAR NOT NULL,
    CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "mail" VARCHAR NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpf" VARCHAR,
    "password" VARCHAR,
    CONSTRAINT "PK_d4261c24987eb5f9e12891a18b9" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "take_back_user_types" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR NOT NULL,
    "isRoot" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "PK_0d6de4433e9fdb82f55d7d9a68a" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "take_back_users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "cpf" VARCHAR NOT NULL,
    "password" VARCHAR,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "email" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userTypeId" INTEGER,
    "resetPasswordToken" VARCHAR,
    "resetPasswordTokenExpiresDate" DATE,
    CONSTRAINT "PK_764061e99182bd434106e00c341" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_payment_methods" (
    "id" SERIAL NOT NULL,
    "cashbackPercentage" DECIMAL(10, 4) NOT NULL DEFAULT 0,
    "cashbackValue" DECIMAL(10, 4) NOT NULL DEFAULT 0,
    "transactionsId" INTEGER,
    "paymentMethodId" INTEGER,
    CONSTRAINT "PK_3d6d4cfd25b7a2628411bd0ebf0" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_status" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR NOT NULL,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "PK_05fbbdf6bc1db819f47975c8c0b" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "totalAmount" DECIMAL(10, 4) DEFAULT 0,
    "amountPayWithOthersMethods" DECIMAL(10, 4) DEFAULT 0,
    "amountPayWithTakebackBalance" DECIMAL(10, 4) DEFAULT 0,
    "takebackFeePercent" DECIMAL(10, 4) DEFAULT 0,
    "takebackFeeAmount" DECIMAL(10, 4) DEFAULT 0,
    "cashbackPercent" DECIMAL(10, 4) DEFAULT 0,
    "cashbackAmount" DECIMAL(10, 4) DEFAULT 0,
    "keyTransaction" INTEGER,
    "cancellationDescription" VARCHAR(180),
    "dateAt" DATE,
    "aprovedAt" DATE,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionStatusId" INTEGER,
    "consumersId" UUID,
    "companiesId" UUID,
    "paymentOrderId" INTEGER,
    "companyUsersId" UUID,
    "backAmount" DECIMAL(10, 4) DEFAULT 0,
    CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfers" (
    "id" SERIAL NOT NULL,
    "value" DECIMAL(10, 4) DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consumerSentId" UUID,
    "consumerReceivedId" UUID,
    CONSTRAINT "PK_f712e908b465e0085b4408cabc3" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zip_codes" (
    "id" SERIAL NOT NULL,
    "zipCode" VARCHAR NOT NULL,
    "citiesId" INTEGER,
    CONSTRAINT "PK_cbf74d68cd9045c650ed5f9f224" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "REL_2bb6583d4cf35554e19694c8a9" ON "companies"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "REL_3ffc911cff52ac729e01188ea1" ON "consumers"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "REL_90e1b79ffd3a5c9e752d86756a" ON "refresh_tokens"("consumerId");

-- CreateIndex
CREATE UNIQUE INDEX "REL_92dd2fbe754c9c44972a73357a" ON "representative_refresh_tokens"("representativeId");

-- AddForeignKey
ALTER TABLE
    "city"
ADD
    CONSTRAINT "FK_e99de556ee56afe72154f3ed04a" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "companies"
ADD
    CONSTRAINT "FK_0d4ef1a2673e3fc3b1934baaea5" FOREIGN KEY ("paymentPlanId") REFERENCES "payment_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "companies"
ADD
    CONSTRAINT "FK_2bb6583d4cf35554e19694c8a9b" FOREIGN KEY ("addressId") REFERENCES "companies_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "companies"
ADD
    CONSTRAINT "FK_78f70c4376dbfc35f8ba9257295" FOREIGN KEY ("statusId") REFERENCES "company_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "companies"
ADD
    CONSTRAINT "FK_bc70297a96701f77de9ef2cc796" FOREIGN KEY ("representativeId") REFERENCES "representative"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "companies"
ADD
    CONSTRAINT "FK_d10b3310c1016d05c123fdd08e1" FOREIGN KEY ("industryId") REFERENCES "industries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "companies_address"
ADD
    CONSTRAINT "FK_f5e207e2b37aaeff6d68a11fe1d" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "company_monthly_payment"
ADD
    CONSTRAINT "FK_053a462e85ddac7b965e9d33654" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "company_monthly_payment"
ADD
    CONSTRAINT "FK_10f7b5e72a6752103ade1acf85a" FOREIGN KEY ("planId") REFERENCES "payment_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "company_payment_methods"
ADD
    CONSTRAINT "FK_50140b197f6a47698d463b4b3aa" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "company_payment_methods"
ADD
    CONSTRAINT "FK_d167c7a5fa7e321ac698cbbc67d" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "company_users"
ADD
    CONSTRAINT "FK_f1c651dcc59347cb084e1ab4163" FOREIGN KEY ("companyUserTypesId") REFERENCES "company_user_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "company_users"
ADD
    CONSTRAINT "FK_f48efdd06dd9b999ae40c3c96a6" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "consumer_address"
ADD
    CONSTRAINT "FK_8a5879957ffa4ceab700ee332a3" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "consumers"
ADD
    CONSTRAINT "FK_3ffc911cff52ac729e01188ea1c" FOREIGN KEY ("addressId") REFERENCES "consumer_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "payment_order"
ADD
    CONSTRAINT "FK_8ca8abb331dc065d7100126aa0f" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_order_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "payment_order"
ADD
    CONSTRAINT "FK_a1a1ef3a6ed218fac0bf633a6ae" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "payment_order"
ADD
    CONSTRAINT "FK_a811f3c6bb72979493ec8958865" FOREIGN KEY ("statusId") REFERENCES "payment_order_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "refresh_tokens"
ADD
    CONSTRAINT "FK_90e1b79ffd3a5c9e752d86756a6" FOREIGN KEY ("consumerId") REFERENCES "consumers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "representative_billing"
ADD
    CONSTRAINT "FK_bb17f4d4ec99f0ecf21fd30b43d" FOREIGN KEY ("representativeId") REFERENCES "representative"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "representative_billing_company"
ADD
    CONSTRAINT "FK_01c37a913fa1c0e5e37f937dffc" FOREIGN KEY ("representativeBillingId") REFERENCES "representative_billing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "representative_billing_company"
ADD
    CONSTRAINT "FK_bdcb7841105f7a02d0dfcef5d68" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "representative_refresh_tokens"
ADD
    CONSTRAINT "FK_92dd2fbe754c9c44972a73357af" FOREIGN KEY ("representativeId") REFERENCES "representative"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "take_back_users"
ADD
    CONSTRAINT "FK_a5f51751e237d232f4e9f44ffda" FOREIGN KEY ("userTypeId") REFERENCES "take_back_user_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "transaction_payment_methods"
ADD
    CONSTRAINT "FK_03ae65f4f819fed4d1837622348" FOREIGN KEY ("transactionsId") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "transaction_payment_methods"
ADD
    CONSTRAINT "FK_74a9dfc67b14713e3fb750a1dbb" FOREIGN KEY ("paymentMethodId") REFERENCES "company_payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "transactions"
ADD
    CONSTRAINT "FK_349047f9afb490b3e4f5f0ee761" FOREIGN KEY ("companyUsersId") REFERENCES "company_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "transactions"
ADD
    CONSTRAINT "FK_3eeb502d7c7f5b94e88d02bfb55" FOREIGN KEY ("paymentOrderId") REFERENCES "payment_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "transactions"
ADD
    CONSTRAINT "FK_41a5467545419633ec789204e91" FOREIGN KEY ("consumersId") REFERENCES "consumers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "transactions"
ADD
    CONSTRAINT "FK_6353b5ceb4106452422b5dc0d33" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "transactions"
ADD
    CONSTRAINT "FK_7d6803adce40f000540e7d5fdb9" FOREIGN KEY ("transactionStatusId") REFERENCES "transaction_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "transfers"
ADD
    CONSTRAINT "FK_5851405b43ff491630a25ccede6" FOREIGN KEY ("consumerSentId") REFERENCES "consumers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "transfers"
ADD
    CONSTRAINT "FK_ae8fb79e0f4f1ce081e6dde6ed1" FOREIGN KEY ("consumerReceivedId") REFERENCES "consumers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "zip_codes"
ADD
    CONSTRAINT "FK_bf8ea20ab6fa9761aa69759c349" FOREIGN KEY ("citiesId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
