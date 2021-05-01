const connection = require('../../../../database/connection');

class PriceRepository {
    async create({ payload }) {
        return await connection('colors')
            .returning('*')
            .insert({
                color: payload.color,
                hexadecimal: payload.hexadecimal,
                descriptionColor: payload.descriptionColor,
            });
    }
}

module.exports = new PriceRepository();
