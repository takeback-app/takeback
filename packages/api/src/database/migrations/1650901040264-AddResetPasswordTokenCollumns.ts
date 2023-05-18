import {MigrationInterface, QueryRunner} from "typeorm";

export class AddResetPasswordTokenCollumns1650901040264 implements MigrationInterface {
    name = 'AddResetPasswordTokenCollumns1650901040264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."take_back_users" ADD "resetPasswordToken" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."take_back_users" ADD "resetPasswordTokenExpiresDate" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."take_back_users" DROP COLUMN "resetPasswordTokenExpiresDate"`);
        await queryRunner.query(`ALTER TABLE "public"."take_back_users" DROP COLUMN "resetPasswordToken"`);
    }

}
