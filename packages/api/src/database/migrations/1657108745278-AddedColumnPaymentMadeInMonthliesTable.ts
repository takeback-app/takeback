import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedColumnPaymentMadeInMonthliesTable1657108745278 implements MigrationInterface {
    name = 'AddedColumnPaymentMadeInMonthliesTable1657108745278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_monthly_payment" ADD "paymentMade" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_monthly_payment" DROP COLUMN "paymentMade"`);
    }

}
