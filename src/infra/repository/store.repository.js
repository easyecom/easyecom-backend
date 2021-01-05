const connection = require('../database/connection');

class StoreRepository {
    async create(payload) {
        return await connection('stores')
            .returning('*')
            .insert(payload);
    }

    async list({ page }) {
        return await connection('stores')
            .limit(10)
            .offset((page - 1) * 10)
            .where('deleted', false)
            .select('*');
    }

    async getById({ storeId }) {
        return await connection('stores')
            .select('*')
            .where({ storeId });
    }

    async update(stores) {
        return await connection('stores')
            .where({ id: stores.id })
            .update(stores, []);
    }

    async delete({ id, deleted }) {
        return await connection('stores')
            .where({ id })
            .update({ deleted }, ['id', 'deleted']);
    }
}

module.exports = new StoreRepository();
