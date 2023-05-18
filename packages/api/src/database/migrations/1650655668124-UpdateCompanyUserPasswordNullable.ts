import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateCompanyUserPasswordNullable1650655668124 implements MigrationInterface {
    name = 'UpdateCompanyUserPasswordNullable1650655668124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_users" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_users" ALTER COLUMN "password" SET NOT NULL`);
    }

}
