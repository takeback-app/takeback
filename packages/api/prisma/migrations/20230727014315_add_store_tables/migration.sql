-- CreateTable
CREATE TABLE "store_products" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" UUID NOT NULL,
    "buyPrice" DECIMAL(10,2) DEFAULT 0,
    "sellPrice" DECIMAL(10,2) DEFAULT 0,
    "stock" INTEGER NOT NULL,
    "maxBuyPerConsumer" INTEGER NOT NULL,
    "dateLimit" TIMESTAMP(3) NOT NULL,
    "dateLimitWithdrawal" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_orders" (
    "id" UUID NOT NULL,
    "consumerId" UUID NOT NULL,
    "storeProductId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "store_orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_orders" ADD CONSTRAINT "store_orders_storeProductId_fkey" FOREIGN KEY ("storeProductId") REFERENCES "store_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_orders" ADD CONSTRAINT "store_orders_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "consumers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
