const connection = require('../../database/connection');

class ProductRepository {
    async create({ payload, store_id }) {
        return await connection('products')
            .returning('*')
            .insert({
                productName: payload.productName,
                isActive: payload.isActive,
                keyWords: payload.keyWords,
                descriptionShort: payload.descriptionShort,
                description: payload.description,
                sku: payload.sku,
                variations: payload.variations,
                evaluations: payload.evaluations,
                images: payload.images,
                externalRefId: payload.externalRefId,
                mainCategory: payload.mainCategory,
                store_id,
                brand_id: payload.brand_id,
            });
    }

    async list({ page, store_id }) {
        return await connection('products')
            .limit(10)
            .offset((parseInt(page) - 1) * 10)
            .where({ store_id })
            .select('*');
    }

    async getById({ productId, store_id }) {
        return await connection('products')
            .select('*')
            .where({ productId, store_id });
    }

    async checkName({ payload, store_id }) {
        return await connection('products')
            .select('*')
            .where({
                store_id,
                productName: payload.productName,
            });
    }

    async checkStore({ store_id }) {
        return await connection('products')
            .where({ store_id })
            .select('*');
    }

    async update({ payload, productId, store_id }) {
        return await connection('products')
            .where({ productId, store_id })
            .update(payload, [
                'productName',
                'isActive',
                'description',
                'products',
                'store_id', // this code not update store from category
                'externalRefId',
            ]);
    }

    async delete({ product_id, store_id }) {
        return await connection('products')
            .where({ productId: product_id, store_id })
            .del();
    }
}

module.exports = new ProductRepository();
