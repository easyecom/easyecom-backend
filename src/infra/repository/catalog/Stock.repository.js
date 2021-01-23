const connection = require('../../database/connection');

class StockRepository {
    async create({ payload, store_id }) {
        return await connection('stocks')
            .returning('*')
            .insert({
                variation_id: payload.stockId,
                quantity: payload.quantity,
                quantityLimit: payload.quantityLimit,
                minimumAmount: payload.minimumAmount,
                maximumAmount: payload.maximumAmount,
                store_id,
            });
    }

    async list({ page, store_id }) {
        return await connection('stocks')
            .limit(10)
            .offset((parseInt(page) - 1) * 10)
            .where({ store_id })
            .select('*');
    }

    async getById({ id, store_id }) {
        return await connection('stocks')
            .select('*')
            .where({ stockId: id, store_id });
    }

    async update({ payload, stock_id, store_id }) {
        return await connection('stocks')
            .where({ stockId: stock_id, store_id })
            .update(payload, [
                'variation_id',
                'quantity',
                'quantityLimit',
                'minimumAmount',
                'maximumAmount',
            ]);
    }

    async delete({ stock_id, store_id }) {
        return await connection('stocks')
            .where({ stockId: stock_id, store_id })
            .del();
    }
}

module.exports = new StockRepository();
