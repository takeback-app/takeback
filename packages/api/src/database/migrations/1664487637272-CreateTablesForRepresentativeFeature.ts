import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTablesForRepresentativeFeature1664487637272 implements MigrationInterface {
    name = 'CreateTablesForRepresentativeFeature1664487637272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "representative_billing_company" ("id" SERIAL NOT NULL, "companyBilling" numeric(10,4) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "representativeBillingId" integer, "companyId" uuid, CONSTRAINT "PK_4207fb14ded7e2ede45b8e1e504" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "representative_billing" ("id" SERIAL NOT NULL, "billingValue" numeric(10,4) NOT NULL DEFAULT '0', "totalCompaniesBilling" numeric(10,4) NOT NULL DEFAULT '0', "representativeFee" numeric(10,4) NOT NULL DEFAULT '0', "isPaid" boolean NOT NULL DEFAULT false, "paidDate" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "representativeId" uuid, CONSTRAINT "PK_3cd53441fab137fcfe0f7205f2c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."representative" ADD "balance" numeric(10,4) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "representative_billing_company" ADD CONSTRAINT "FK_01c37a913fa1c0e5e37f937dffc" FOREIGN KEY ("representativeBillingId") REFERENCES "representative_billing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "representative_billing_company" ADD CONSTRAINT "FK_bdcb7841105f7a02d0dfcef5d68" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "representative_billing" ADD CONSTRAINT "FK_bb17f4d4ec99f0ecf21fd30b43d" FOREIGN KEY ("representativeId") REFERENCES "representative"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "representative_billing" DROP CONSTRAINT "FK_bb17f4d4ec99f0ecf21fd30b43d"`);
        await queryRunner.query(`ALTER TABLE "representative_billing_company" DROP CONSTRAINT "FK_bdcb7841105f7a02d0dfcef5d68"`);
        await queryRunner.query(`ALTER TABLE "representative_billing_company" DROP CONSTRAINT "FK_01c37a913fa1c0e5e37f937dffc"`);
        await queryRunner.query(`ALTER TABLE "public"."representative" DROP COLUMN "balance"`);
        await queryRunner.query(`DROP TABLE "representative_billing"`);
        await queryRunner.query(`DROP TABLE "representative_billing_company"`);
    }

}
