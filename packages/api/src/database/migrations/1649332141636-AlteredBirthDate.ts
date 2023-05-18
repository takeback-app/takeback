import {MigrationInterface, QueryRunner} from "typeorm";

export class AlteredBirthDate1649332141636 implements MigrationInterface {
    name = 'AlteredBirthDate1649332141636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."consumers" ALTER COLUMN "birthDate" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."consumers" ALTER COLUMN "birthDate" SET NOT NULL`);
    }

}
