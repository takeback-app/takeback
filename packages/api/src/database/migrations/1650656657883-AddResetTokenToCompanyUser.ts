import {MigrationInterface, QueryRunner} from "typeorm";

export class AddResetTokenToCompanyUser1650656657883 implements MigrationInterface {
    name = 'AddResetTokenToCompanyUser1650656657883'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_users" ADD "resetPasswordToken" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."company_users" ADD "resetPasswordTokenExpiresDate" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_users" DROP COLUMN "resetPasswordTokenExpiresDate"`);
        await queryRunner.query(`ALTER TABLE "public"."company_users" DROP COLUMN "resetPasswordToken"`);
    }

}
