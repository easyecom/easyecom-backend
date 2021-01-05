const connection = require('../../../../infra/database/connection');

class PricesController {
    async update(req, res) {
        const { store_id } = req.params;
        const {
            variation_id,
            costPrice,
            offerPrice,
            salesPrice,
            promotion,
        } = req.body;

        try {
            let [checkPrices] = await connection('prices')
                .where({ variation_id, store_id })
                .select('*');

            if (checkPrices) {
                let [updatePrice] = await connection('prices')
                    .returning('*')
                    .update(
                        {
                            variation_id,
                            costPrice,
                            offerPrice,
                            salesPrice,
                            promotion,
                        },
                        [
                            'variation_id',
                            'costPrice',
                            'offerPrice',
                            'salesPrice',
                            'promotion',
                        ]
                    )
                    .where({ variation_id, store_id });

                return res.json(updatePrice);
            }

            let createPrice = await connection('prices')
                .returning('*')
                .insert({
                    variation_id,
                    costPrice,
                    offerPrice,
                    salesPrice,
                    promotion,
                    store_id,
                });

            return res.json(createPrice);
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

            const prices = await connection('prices')
                .select('*')
                .where({
                    'prices.store_id': store_id,
                });

            return res.status(200).json({ prices });
        } catch (err) {
            console.log(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getById(req, res) {
        const { store_id, price_id } = req.params;

        try {
            const [price] = await connection('prices')
                .where({ variation_id: price_id, store_id })
                .select('*');

            if (!price) {
                return res
                    .status(404)
                    .json({ error: { message: 'Price does not exist' } });
            }

            return res.status(200).json(price);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async delete(req, res) {
        const { store_id, price_id } = req.params;

        try {
            const checkPrice = await connection('prices')
                .where({ variation_id: price_id, store_id })
                .select('*');

            if (!checkPrice.length) {
                return res
                    .status(404)
                    .json({ error: { message: ' Price does not exist' } });
            }

            await connection('prices')
                .where({ variation_id: price_id, store_id })
                .del();

            return res
                .status(200)
                .json({ message: 'Price removed successfully' });
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }
}
module.exports = new PricesController();
