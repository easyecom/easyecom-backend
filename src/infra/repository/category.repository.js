const connection = require('../database/connection');

class CategoryRepository {
    async create({ payload, store_id }) {
        return await connection('categories')
            .returning('*')
            .insert({
                categoryName: payload.categoryName,
                description: payload.description,
                refId: payload.refId,
                isActive: payload.isActive,
                products: [],
                store_id,
            });
    }

    async list({ page, store_id }) {
        return await connection('categories')
            .limit(10)
            .offset((parseInt(page) - 1) * 10)
            .where({ store_id })
            .select('*');
    }

    async getById({ id, store_id }) {
        return await connection('categories')
            .select('*')
            .where({ categoryId: id, store_id });
    }

    async checkName({ payload, store_id }) {
        return await connection('categories')
            .select('*')
            .where({
                store_id,
                categoryName: payload.categoryName,
            });
    }

    async update({ payload, category_id, store_id }) {
        return await connection('categories')
            .where({ categoryId: category_id, store_id })
            .update(payload, [
                'categoryName',
                'isActive',
                'description',
                'products',
                'store_id', // this code not update store from category
                'refId',
            ]);
    }

    async delete({ category_id, store_id }) {
        return await connection('categories')
            .where({ categoryId: category_id, store_id })
            .del();
    }
}

module.exports = new CategoryRepository();
