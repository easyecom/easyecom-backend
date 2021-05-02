const connection = require('../../../../database/connection');

class SizeRepository {
    async create({ payload }) {
        return await connection('sizes')
            .returning('*')
            .insert({
                size: payload.size,
                typeProduct: payload.typeProduct,
                description: payload.description,
            });
    }
}

module.exports = new SizeRepository();
