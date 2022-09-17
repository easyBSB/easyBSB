const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class easybsbDevices1662227913445 {
    name = 'easybsbDevices1662227913445'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "device" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bus_id" integer NOT NULL, "address" numeric NOT NULL, "vendor" integer NOT NULL, "vendor_device" numeric)`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "device"`);
    }
}
