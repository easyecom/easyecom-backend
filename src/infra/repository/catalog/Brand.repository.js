const connection = require('../../database/connection');

class BrandRepository {
    async create({ payload, store_id }) {
        return await connection('brands')
            .returning('*')
            .insert({
                brandName: payload.brandName,
                description: payload.description,
                isActive: payload.isActive,
                refId: payload.refId,
                products: payload.products,
                store_id,
            });
    }

    async list({ page, store_id }) {
        return await connection('brands')
            .limit(20)
            .offset((parseInt(page) - 1) * 20)
            .where({ store_id })
            .select('*');
    }

    async getById({ brandId, store_id }) {
        return await connection('brands')
            .select('*')
            .where({ brandId, store_id });
    }

    async checkName({ payload, store_id }) {
        return await connection('brands')
            .select('*')
            .where({
                store_id,
                brandName: payload.brandName,
            });
    }

    async update({ payload, brandId, store_id }) {
        return await connection('brands')
            .where({ brandId, store_id })
            .update(payload, [
                'brandName',
                'isActive',
                'description',
                'products',
                'store_id', // this code not update store from category
                'refId',
            ]);
    }

    async delete({ brandId, store_id }) {
        return await connection('brands')
            .where({ brandId, store_id })
            .del();
    }
}

module.exports = new BrandRepository();
