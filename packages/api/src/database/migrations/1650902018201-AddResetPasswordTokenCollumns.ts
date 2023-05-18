import {MigrationInterface, QueryRunner} from "typeorm";

export class AddResetPasswordTokenCollumns1650902018201 implements MigrationInterface {
    name = 'AddResetPasswordTokenCollumns1650902018201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."take_back_users" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."take_back_users" ALTER COLUMN "password" SET NOT NULL`);
    }

}
