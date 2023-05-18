import {MigrationInterface, QueryRunner} from "typeorm";

export class AddEmailToCompanyUser1650650519844 implements MigrationInterface {
    name = 'AddEmailToCompanyUser1650650519844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_users" ADD "email" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_users" DROP COLUMN "email"`);
    }

}
