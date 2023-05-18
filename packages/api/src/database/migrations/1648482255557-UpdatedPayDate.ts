import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedPayDate1648482255557 implements MigrationInterface {
    name = 'UpdatedPayDate1648482255557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."settings" DROP COLUMN "payDate"`);
        await queryRunner.query(`ALTER TABLE "public"."settings" ADD "payDate" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."settings" DROP COLUMN "payDate"`);
        await queryRunner.query(`ALTER TABLE "public"."settings" ADD "payDate" TIMESTAMP NOT NULL`);
    }

}
