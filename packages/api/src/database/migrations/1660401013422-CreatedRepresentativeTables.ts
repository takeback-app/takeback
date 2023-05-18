import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatedRepresentativeTables1660401013422 implements MigrationInterface {
    name = 'CreatedRepresentativeTables1660401013422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "representative" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "cpf" character varying NOT NULL, "phone" character varying, "email" character varying, "whatsapp" character varying, "isActive" boolean NOT NULL DEFAULT true, "gainPercentage" numeric(10,4) NOT NULL DEFAULT '0', "password" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2abe568eacaba9eba605bb231bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "representative_refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "expiresIn" integer NOT NULL, "representativeId" uuid, CONSTRAINT "REL_92dd2fbe754c9c44972a73357a" UNIQUE ("representativeId"), CONSTRAINT "PK_a575bc1c9d1d1bc490618296f74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD "representativeId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD CONSTRAINT "FK_bc70297a96701f77de9ef2cc796" FOREIGN KEY ("representativeId") REFERENCES "representative"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "representative_refresh_tokens" ADD CONSTRAINT "FK_92dd2fbe754c9c44972a73357af" FOREIGN KEY ("representativeId") REFERENCES "representative"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "representative_refresh_tokens" DROP CONSTRAINT "FK_92dd2fbe754c9c44972a73357af"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP CONSTRAINT "FK_bc70297a96701f77de9ef2cc796"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP COLUMN "representativeId"`);
        await queryRunner.query(`DROP TABLE "representative_refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "representative"`);
    }

}
