const connection = require('../../database/connection');

class ProductRepository {
    async create({ payload, store_id }) {
        return await connection('products')
            .returning('*')
            .insert({
                productName: payload.productName,
                isActive: payload.isActive,
                keyWords: payload.keyWords,
                title: payload.title,
                descriptionShort: payload.descriptionShort,
                description: payload.description,
                sku: payload.sku,
                variations: payload.variations,
                evaluations: payload.evaluations,
                images: payload.images,
                refId: payload.refId,
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

    async getById({ id, store_id }) {
        return await connection('products')
            .select('*')
            .where({ productId: id, store_id });
    }

    async checkName({ payload, store_id }) {
        return await connection('products')
            .select('*')
            .where({
                store_id,
                brandName: payload.brandName,
            });
    }

    async update({ payload, product_id, store_id }) {
        return await connection('products')
            .where({ productId: product_id, store_id })
            .update(payload, [
                'productName',
                'isActive',
                'description',
                'products',
                'store_id', // this code not update store from category
                'refId',
            ]);
    }

    async delete({ product_id, store_id }) {
        return await connection('products')
            .where({ productId: product_id, store_id })
            .del();
    }
}

module.exports = new ProductRepository();
