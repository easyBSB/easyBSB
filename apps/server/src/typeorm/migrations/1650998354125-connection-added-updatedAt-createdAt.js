const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class connectionAddedUpdatedAtCreatedAt1650998354125 {
    name = 'connectionAddedUpdatedAtCreatedAt1650998354125'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "temporary_easy_bsb_connection" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "ip" varchar NOT NULL, "port" integer NOT NULL, "hostId" integer NOT NULL, "createdAt" integer NOT NULL, "updatedAt" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_easy_bsb_connection"("id", "name", "ip", "port", "hostId") SELECT "id", "name", "ip", "port", "hostId" FROM "easy_bsb_connection"`);
        await queryRunner.query(`DROP TABLE "easy_bsb_connection"`);
        await queryRunner.query(`ALTER TABLE "temporary_easy_bsb_connection" RENAME TO "easy_bsb_connection"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "easy_bsb_connection" RENAME TO "temporary_easy_bsb_connection"`);
        await queryRunner.query(`CREATE TABLE "easy_bsb_connection" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "ip" varchar NOT NULL, "port" integer NOT NULL, "hostId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "easy_bsb_connection"("id", "name", "ip", "port", "hostId") SELECT "id", "name", "ip", "port", "hostId" FROM "temporary_easy_bsb_connection"`);
        await queryRunner.query(`DROP TABLE "temporary_easy_bsb_connection"`);
    }
}
