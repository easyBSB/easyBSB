const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class easybsbBus1661727106251 {
    name = 'easybsbBus1661727106251'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "bus" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "address" numeric NOT NULL, "name" varchar NOT NULL, "type" varchar NOT NULL, "port" numeric)`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "bus"`);
    }
}
