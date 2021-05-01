const connection = require('../../../../database/connection');

class ColorRepository {
    async create({ payload }) {
        return await connection('colors')
            .returning('*')
            .insert({
                colorName: payload.colorName,
                hexadecimal: payload.hexadecimal,
                description: payload.description,
            });
    }
}

module.exports = new ColorRepository();
