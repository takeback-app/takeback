import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCollumnToQRCodeInSettingsTable1656598581054 implements MigrationInterface {
    name = 'AddCollumnToQRCodeInSettingsTable1656598581054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."settings" ADD "takebackQRCode" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."settings" DROP COLUMN "takebackQRCode"`);
    }

}
