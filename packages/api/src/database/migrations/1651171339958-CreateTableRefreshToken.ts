import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTableRefreshToken1651171339958 implements MigrationInterface {
    name = 'CreateTableRefreshToken1651171339958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "expiresIn" integer NOT NULL, "consumerId" uuid, CONSTRAINT "REL_90e1b79ffd3a5c9e752d86756a" UNIQUE ("consumerId"), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_90e1b79ffd3a5c9e752d86756a6" FOREIGN KEY ("consumerId") REFERENCES "consumers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_90e1b79ffd3a5c9e752d86756a6"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    }

}
