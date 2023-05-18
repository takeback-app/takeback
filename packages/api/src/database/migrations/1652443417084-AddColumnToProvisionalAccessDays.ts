import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnToProvisionalAccessDays1652443417084 implements MigrationInterface {
    name = 'AddColumnToProvisionalAccessDays1652443417084'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."settings" ADD "provisionalAccessDays" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."settings" DROP COLUMN "provisionalAccessDays"`);
    }

}
