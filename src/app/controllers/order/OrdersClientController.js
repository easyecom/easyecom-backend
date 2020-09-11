const connection = require('../../../database/connection');

class OrdersController {
    async create(req, res) {
        const { store_id } = req.params;
        const { client_id, shoppingCart, delivery_id, cancel } = req.body;

        try {
            const data = await connection('orders')
                .returning('*')
                .insert({
                    client_id,
                    shoppingCart,
                    delivery_id,
                    cancel,
                    store_id,
                });

            return res.status(201).json(data);
        } catch (err) {
            console.error(err);
        }
    }

    async findAll({ params }, res) {
        const { store_id, client_id } = params;

        try {
            const data = await connection('orders')
                .select('*')
                .where({
                    'orders.store_id': store_id,
                    'orders.client_id': client_id,
                });

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
        }
    }

    async findOne({ params }, res) {
        const { store_id, id } = params;

        try {
            const data = await connection('orders').where({
                'orders.store_id': store_id,
                'orders.id': id,
            });

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
        }
    }

    async delete({ params }, res) {
        const { store_id, id } = params;

        try {
            await connection('orders')
                .where({
                    'orders.store_id': store_id,
                    'orders.id': id,
                })
                .del();

            return res.status(200).json({ message: 'order deleted success' });
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = new OrdersController();
