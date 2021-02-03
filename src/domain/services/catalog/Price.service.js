const connection = require('../../database/connection');

class PriceRepository {
    async create({ payload, store_id }) {
        return await connection('prices')
            .returning('*')
            .insert({
                variation_id: payload.variationId,
                costPrice: payload.cost_price,
                offerPrice: payload.offer_price,
                salesPrice: payload.sales_price,
                promotion: payload.promotion,
                store_id,
            });
    }

    async list({ page, store_id }) {
        return await connection('prices')
            .limit(10)
            .offset((parseInt(page) - 1) * 10)
            .where({ store_id })
            .select('*');
    }

    async getById({ id, store_id }) {
        return await connection('prices')
            .select('*')
            .where({ variationId: id, store_id });
    }

    async update({ payload, price_id, store_id }) {
        return await connection('prices')
            .where({ variationId: price_id, store_id })
            .update(payload, [
                'productName',
                'isActive',
                'description',
                'prices',
                'store_id', // this code not update store from category
                'refId',
            ]);
    }

    async delete({ price_id, store_id }) {
        return await connection('prices')
            .where({ variationId: price_id, store_id })
            .del();
    }
}

module.exports = new PriceRepository();
