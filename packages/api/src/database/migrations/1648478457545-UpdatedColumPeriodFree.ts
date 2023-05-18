import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedColumPeriodFree1648478457545 implements MigrationInterface {
    name = 'UpdatedColumPeriodFree1648478457545'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."companies" ALTER COLUMN "periodFree" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."companies" ALTER COLUMN "periodFree" SET DEFAULT false`);
    }

}
