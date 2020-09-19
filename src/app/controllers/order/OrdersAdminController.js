const connection = require('../../../database/connection');

class AdminOrdersController {
    async findAll({ params }, res) {
        const { store_id } = params;

        try {
            const data = await connection('orders')
                .where('store_id', store_id)
                .select(
                    'orderId',
                    'client_id',
                    'shoppingCart',
                    'delivery_id',
                    'store_id',
                    'cancel'
                );

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
        }
    }

    async listOrdersByClient({ params }, res) {
        const { store_id, client_id } = params;

        try {
            const data = await connection('orders')
                .where({
                    client_id: client_id,
                    store_id: store_id,
                })
                .select(
                    'orderId',
                    'client_id',
                    'shoppingCart',
                    'delivery_id',
                    'store_id',
                    'cancel'
                );
            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
        }
    }

    async findOne({ params }, res) {
        const { store_id, order_id } = params;

        try {
            const data = await connection('orders')
                .where({
                    order_id: order_id,
                    store_id: store_id,
                })
                .select(
                    'orderId',
                    'client_id',
                    'shoppingCart',
                    'delivery_id',
                    'store_id',
                    'cancel'
                );
            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
        }
    }

    async delete({ params }, res) {
        const { store_id, order_id } = params;

        try {
            await connection('orders')
                .where({ order_id: order_id, store_id: store_id })
                .del();
            return res.status(200).json({ message: 'order deleted success' });
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = new AdminOrdersController();
