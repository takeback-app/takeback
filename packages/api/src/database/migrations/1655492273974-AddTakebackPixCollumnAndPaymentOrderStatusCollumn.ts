import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTakebackPixCollumnAndPaymentOrderStatusCollumn1655492273974 implements MigrationInterface {
    name = 'AddTakebackPixCollumnAndPaymentOrderStatusCollumn1655492273974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."payment_order_methods" ADD "isActive" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "public"."settings" ADD "takebackPixKey" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."settings" DROP COLUMN "takebackPixKey"`);
        await queryRunner.query(`ALTER TABLE "public"."payment_order_methods" DROP COLUMN "isActive"`);
    }

}
