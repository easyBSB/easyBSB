const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class easybsbBusInit1661095958146 {
    name = 'easybsbBusInit1661095958146'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "bus" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "address" numeric NOT NULL, "address_is_hex" boolean NOT NULL DEFAULT (0), "name" varchar NOT NULL, "type" varchar NOT NULL, "port" numeric)`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "bus"`);
    }
}
