-- CreateTable
CREATE TABLE "representative_addresses" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "representativeId" UUID NOT NULL,
    "cityId" INTEGER NOT NULL,
    "street" VARCHAR,
    "district" VARCHAR,
    "number" VARCHAR,
    "complement" VARCHAR,
    "zipCode" VARCHAR,

    CONSTRAINT "representative_addresses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "representative_addresses" ADD CONSTRAINT "representative_addresses_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "representatives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "representative_addresses" ADD CONSTRAINT "representative_addresses_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
