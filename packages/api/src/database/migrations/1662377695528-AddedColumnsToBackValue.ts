import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedColumnsToBackValue1662377695528 implements MigrationInterface {
    name = 'AddedColumnsToBackValue1662377695528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD "backAmount" numeric(10,4) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD "useCashbackAsBack" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP COLUMN "useCashbackAsBack"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP COLUMN "backAmount"`);
    }

}
