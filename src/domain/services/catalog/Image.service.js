const connection = require('../../database/connection');

class ImageRepository {
    async create({ payload, store_id }) {
        return await connection('images')
            .returning('*')
            .insert({
                name: payload.originalname,
                path: payload.key,
                key: payload.key,
                size: payload.size,
                url: payload.url,
                category_id: payload.category_id,
                product_id: payload.product_id,
                variation_id: payload.variation_id,
                brand_id: payload.brand_id,
            });
    }

    async list({ page, store_id }) {
        return await connection('images')
            .limit(10)
            .offset((parseInt(page) - 1) * 10)
            .where({ store_id })
            .select('*');
    }

    async getById({ id, store_id }) {
        return await connection('images')
            .select('*')
            .where({ id, store_id });
    }

    async update({ payload, id, store_id }) {
        return await connection('images')
            .where({ id, store_id })
            .update(payload, [
                'clientName',
                'evaluationText',
                'imagescore',
                'product_id',
            ]);
    }

    async delete({ image_id, store_id }) {
        return await connection('images')
            .where({ id: image_id, store_id })
            .del();
    }
}

module.exports = new ImageRepository();
