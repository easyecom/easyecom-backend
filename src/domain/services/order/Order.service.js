const connection = require('../../database/connection');

class OrderRepository {
    async create({ payload, store_id }) {
        return await connection('orders')
            .returning('*')
            .insert({
                client_id: payload.client_id,
                cart: payload.cart,
                cancel: payload.cancel,
                store_id,
            });
    }

    async listAll({ page, store_id }) {
        return await connection('orders')
            .join('clients', 'clients.clientId', 'orders.client_id')
            .join('users', 'clients.user_id', 'users.userId')
            // .join('addresses', 'addresses.user_id', 'users.userId')
            .limit(limit)
            .offset(page * limit)
            .where('orders.store_id', store_id)
            .select('*', 'orders.created_at', 'orders.updated_at')
            .limit(10)
            .offset((parseInt(page) - 1) * 10)
            .where({ store_id })
            .select('*');
    }

    async list({ page, store_id }) {
        return await connection('orders')
            .limit(10)
            .offset((parseInt(page) - 1) * 10)
            .where({ store_id })
            .select('*');
    }

    async getById({ id, store_id }) {
        return await connection('orders')
            .select('*')
            .where({ orderId: id, store_id });
    }

    async listOrderByClient({ payload, store_id }) {
        return await connection('orders')
            .where({
                client_id: payload.client_id,
                store_id,
            })
            .select('*');
    }

    async update({ payload, price_id, store_id }) {
        return await connection('orders')
            .where({ orderId: price_id, store_id })
            .update(payload, [
                'productName',
                'isActive',
                'description',
                'orders',
                'store_id', // this code not update store from category
                'externalRefId',
            ]);
    }

    async delete({ price_id, store_id }) {
        return await connection('orders')
            .where({ orderId: price_id, store_id })
            .del();
    }
}

module.exports = new OrderRepository();
