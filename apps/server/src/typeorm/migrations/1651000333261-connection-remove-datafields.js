const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class connectionRemoveDatafields1651000333261 {
    name = 'connectionRemoveDatafields1651000333261'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "temporary_easy_bsb_connection" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "ip" varchar NOT NULL, "port" integer NOT NULL, "hostId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_easy_bsb_connection"("id", "name", "ip", "port", "hostId") SELECT "id", "name", "ip", "port", "hostId" FROM "easy_bsb_connection"`);
        await queryRunner.query(`DROP TABLE "easy_bsb_connection"`);
        await queryRunner.query(`ALTER TABLE "temporary_easy_bsb_connection" RENAME TO "easy_bsb_connection"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "easy_bsb_connection" RENAME TO "temporary_easy_bsb_connection"`);
        await queryRunner.query(`CREATE TABLE "easy_bsb_connection" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "ip" varchar NOT NULL, "port" integer NOT NULL, "hostId" integer NOT NULL, "createdAt" varchar NOT NULL, "updatedAt" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "easy_bsb_connection"("id", "name", "ip", "port", "hostId") SELECT "id", "name", "ip", "port", "hostId" FROM "temporary_easy_bsb_connection"`);
        await queryRunner.query(`DROP TABLE "temporary_easy_bsb_connection"`);
    }
}
