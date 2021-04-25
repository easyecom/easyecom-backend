const connection = require('../../database/connection');

class CategoryRepository {
    async create({ payload, store_id }) {
        return await connection('categories')
            .returning('*')
            .insert({
                categoryName: payload.categoryName,
                description: payload.description,
                externalRefId: payload.externalRefId,
                isActive: payload.isActive,
                products: [],
                store_id,
            });
    }

    async list({ page, store_id }) {
        return await connection('categories')
            .limit(20)
            .offset((parseInt(page) - 1) * 20)
            .where({ store_id })
            .select('*');
    }

    async getById({ categoryId, store_id }) {
        return await connection('categories')
            .select('*')
            .where({ categoryId, store_id });
    }

    async checkName({ payload, store_id }) {
        return await connection('categories')
            .select('*')
            .where({
                store_id,
                categoryName: payload.categoryName,
            });
    }

    async update({ payload, categoryId, store_id }) {
        return await connection('categories')
            .where({ categoryId, store_id })
            .update(payload, [
                'categoryName',
                'isActive',
                'description',
                'products',
                'store_id', // this code not update store from category
                'externalRefId',
            ]);
    }

    async delete({ categoryId, store_id }) {
        return await connection('categories')
            .where({ categoryId, store_id })
            .del();
    }
}

module.exports = new CategoryRepository();
