import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatedColumToSupportPasswordAndCpf1654794555295 implements MigrationInterface {
    name = 'CreatedColumToSupportPasswordAndCpf1654794555295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD "permissionToSupportAccess" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "public"."support_users" ADD "cpf" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."support_users" ADD "password" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."support_users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "public"."support_users" DROP COLUMN "cpf"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP COLUMN "permissionToSupportAccess"`);
    }

}
