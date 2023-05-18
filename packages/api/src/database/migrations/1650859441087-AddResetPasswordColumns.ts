import {MigrationInterface, QueryRunner} from "typeorm";

export class AddResetPasswordColumns1650859441087 implements MigrationInterface {
    name = 'AddResetPasswordColumns1650859441087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."consumers" ADD "resetPasswordToken" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."consumers" ADD "resetPasswordTokenExpiresDate" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."consumers" DROP COLUMN "resetPasswordTokenExpiresDate"`);
        await queryRunner.query(`ALTER TABLE "public"."consumers" DROP COLUMN "resetPasswordToken"`);
    }

}
