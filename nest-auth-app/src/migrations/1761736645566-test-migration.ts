import { MigrationInterface, QueryRunner } from 'typeorm';

export class TestMigration1761736645566 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "Role" AS ENUM ('INTERN', 'ENGINEER', 'ADMIN');`,
    );
    await queryRunner.query(
      `CREATE TABLE "Employee" (
            "id" SERIAL NOT NULL,
            "name" TEXT NOT NULL,
            "email" TEXT NOT NULL,
            "role" "Role" NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,

            CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
        );

        -- CreateIndex
        CREATE UNIQUE INDEX "Employee_name_key" ON "Employee"("name");

        -- CreateIndex
        CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TYPE IF EXISTS "Role";
        DROP TABLE IF EXISTS "Employee";
        DROP INDEX IF EXISTS "Employee_name_key";
        DROP INDEX IF EXISTS "Employee_email_key";
    `);
  }
}
