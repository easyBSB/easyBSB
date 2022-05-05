const { MigrationInterface, QueryRunner } = require("typeorm");
const { hashSync } = require("bcrypt")

module.exports = class insertDefaultUser1651611721903 {

    async up(queryRunner) {
        const password = hashSync('easybsb', 10)
        const name = 'easybsb'

        await queryRunner.query(`INSERT INTO user_entity (name, password, userNeedPasswordChange) VALUES("${name}", "${password}", true)`)
    }

    async down(queryRunner) {
        // @not empty
    }

}
