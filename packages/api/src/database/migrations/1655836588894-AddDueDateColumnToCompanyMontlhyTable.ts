import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDueDateColumnToCompanyMontlhyTable1655836588894 implements MigrationInterface {
    name = 'AddDueDateColumnToCompanyMontlhyTable1655836588894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_monthly_payment" ADD "dueDate" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_monthly_payment" DROP COLUMN "dueDate"`);
    }

}
