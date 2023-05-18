import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCPFFildToCompayUser1650977031744 implements MigrationInterface {
    name = 'AddCPFFildToCompayUser1650977031744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_users" ADD "cpf" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_users" DROP COLUMN "cpf"`);
    }

}
