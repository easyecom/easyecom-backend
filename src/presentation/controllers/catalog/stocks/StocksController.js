const connection = require('../../../../infra/database/connection');

class StockController {
    async update(req, res) {
        const { store_id } = req.params;
        const {
            variation_id,
            quantity,
            quantityLimit,
            minimumAmount,
            maximumAmount,
        } = req.body;

        try {
            let [checkstocks] = await connection('stocks')
                .where({ variation_id, store_id })
                .select('*');

            if (checkstocks) {
                let [updateStocks] = await connection('stocks')
                    .returning('*')
                    .update(
                        {
                            variation_id,
                            quantity,
                            quantityLimit,
                            minimumAmount,
                            maximumAmount,
                        },
                        [
                            'variation_id',
                            'quantity',
                            'quantityLimit',
                            'minimumAmount',
                            'maximumAmount',
                        ]
                    )
                    .where({ variation_id, store_id });

                return res.json(updateStocks);
            }

            let createStock = await connection('stocks')
                .returning('*')
                .insert({
                    variation_id,
                    quantity,
                    quantityLimit,
                    minimumAmount,
                    maximumAmount,
                    store_id,
                });

            return res.json(createStock);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getAll(req, res) {
        try {
            const { store_id } = req.params;
            // const { page = 1 } = req.query;

            const checkStore = await connection('stores').where({
                storeId: store_id,
            });

            if (!checkStore.length) {
                return res
                    .status(404)
                    .json({ error: { message: 'store does not exist' } });
            }

            const stocks = await connection('stocks')
                .select('*')
                .where({
                    'stocks.store_id': store_id,
                });

            return res.status(200).json({ stocks });
        } catch (err) {
            console.log(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getById(req, res) {
        const { store_id, stock_id } = req.params;

        try {
            const [stock] = await connection('stocks')
                .where({ variation_id: stock_id, store_id })
                .select('*');

            if (!stock) {
                return res
                    .status(404)
                    .json({ error: { message: 'stock does not exist' } });
            }

            return res.status(200).json(stock);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async delete(req, res) {
        const { store_id, stock_id } = req.params;

        try {
            const checkstock = await connection('stocks')
                .where({ variation_id: stock_id, store_id })
                .select('*');

            if (!checkstock.length) {
                return res
                    .status(404)
                    .json({ error: { message: ' stock does not exist' } });
            }

            await connection('stocks')
                .where({ variation_id: stock_id, store_id })
                .del();

            return res
                .status(200)
                .json({ message: 'stock removed successfully' });
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }
}
module.exports = new StockController();
