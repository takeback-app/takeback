-- CreateTable
CREATE TABLE "withdraw_order_status" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "withdraw_order_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdraw_orders" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "value" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "pixKey" TEXT NOT NULL,
    "companyId" UUID NOT NULL,
    "statusId" INTEGER NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "withdraw_orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "withdraw_orders" ADD CONSTRAINT "withdraw_orders_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdraw_orders" ADD CONSTRAINT "withdraw_orders_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "withdraw_order_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
