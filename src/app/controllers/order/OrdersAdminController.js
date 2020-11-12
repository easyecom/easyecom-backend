const connection = require('../../../database/connection');
const getOrderById = require('./helpers/getOrderById');
const orderDT = require('./helpers/order.dt');
class AdminOrdersController {
    async findAll({ params, query }, res) {
        const { store_id } = params;
        const { page = 1, limit } = query;

        try {
            let data = await connection('orders')
                .join('clients', 'clients.clientId', 'orders.client_id')
                .join('users', 'clients.user_id', 'users.userId')
                // .join('addresses', 'addresses.user_id', 'users.userId')
                .limit(limit)
                .offset(page * limit)
                .where('orders.store_id', store_id)
                .select('*', 'orders.created_at', 'orders.updated_at');

            data = await orderDT(data);

            const total = data.length;

            return res.status(200).send({ orders: data, total });
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
                    'cart',
                    'delivery_id',
                    'store_id',
                    'cancel',
                    'created_at'
                );
            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
        }
    }

    async findOne({ params }, res) {
        const { store_id, order_id } = params;

        try {
            const data = await getOrderById({
                res,
                connection,
                store_id,
                order_id,
            });

            return res.status(200).send({ order: data });
        } catch (err) {
            console.error(err);
        }
    }

    async delete({ params }, res) {
        const { store_id, order_id } = params;

        try {
            await connection('orders')
                .where({ orderId: order_id, store_id })
                .del();
            return res.status(200).json({ message: 'order deleted success' });
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = new AdminOrdersController();
