import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCollumnIsForgivenToCompanyMonthlyPayment1655985298706 implements MigrationInterface {
    name = 'AddCollumnIsForgivenToCompanyMonthlyPayment1655985298706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_monthly_payment" ADD "isForgiven" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_monthly_payment" DROP COLUMN "isForgiven"`);
    }

}
