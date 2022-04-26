const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class connectionInitialize1650998287491 {
    name = 'connectionInitialize1650998287491'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "easy_bsb_connection" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "ip" varchar NOT NULL, "port" integer NOT NULL, "hostId" integer NOT NULL)`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "easy_bsb_connection"`);
    }
}
