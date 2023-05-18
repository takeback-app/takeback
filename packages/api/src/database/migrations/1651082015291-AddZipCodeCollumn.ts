import {MigrationInterface, QueryRunner} from "typeorm";

export class AddZipCodeCollumn1651082015291 implements MigrationInterface {
    name = 'AddZipCodeCollumn1651082015291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."companies_address" ADD "zipCode" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."consumer_address" ADD "zipCode" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."consumer_address" DROP COLUMN "zipCode"`);
        await queryRunner.query(`ALTER TABLE "public"."companies_address" DROP COLUMN "zipCode"`);
    }

}
