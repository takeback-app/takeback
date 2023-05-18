import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnPeriodFree1648476347634 implements MigrationInterface {
    name = 'AddColumnPeriodFree1648476347634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD "periodFree" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP COLUMN "periodFree"`);
    }

}
