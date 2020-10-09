const connection = require('../../../database/connection');

class AdminOrdersController {
    async findAll({ params }, res) {
        const { store_id } = params;

        try {
            // .join('users', 'users.userId', 'clients.user_id')
            // .join('addresses', 'addresses.user_id', 'users.userId')

            let data = await connection('orders')
                .join('clients', 'clients.clientId', 'orders.client_id')
                .join('users', 'clients.user_id', 'users.userId')
                .join('addresses', 'addresses.user_id', 'users.userId')
                .where('orders.store_id', store_id)
                .select('*');

            data = data.map(item => {
                return {
                    Id: item.orderId,
                    store_id: item.store_id,
                    delivery_id: item.delivery_id,

                    customer: {
                        user_id: item.user_id,
                        cpf: item.cpf,
                        userName: item.userName,
                        email: item.email,
                        dateOfBirth: item.dateOfBirth,
                        addresses: {
                            addressId: item.addressId,
                            zipcode: item.zipcode,
                            street: item.street,
                            number: item.number,
                            complement: item.complement,
                            neighborhood: item.neighborhood,
                            city: item.city,
                            state: item.state,
                            state_code: item.state_code,
                            country: item.country,
                            storeIdToAddress: item.storeIdToAddress,
                        },
                    },
                    items: item.shoppingCart,
                    deleted: item.deleted,
                    created_at: item.created_at,
                    updated_at: item.updated_at,
                };
            });
            return res.status(200).send({ orders: data });
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
        // const { user_admin } = req.headers;

        try {
            const data = await connection('orders')
                .where({
                    orderId: order_id,
                    store_id: store_id,
                })
                .select(
                    'orderId',
                    'client_id',
                    'shoppingCart',
                    'delivery_id',
                    'store_id',
                    'cancel',
                    'updated_at'
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
