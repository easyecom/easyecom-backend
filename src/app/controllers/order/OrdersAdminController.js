const connection = require('../../../database/connection');
const getOrderById = require('../helpers/getOrderById');
class AdminOrdersController {
    async findAll({ params, query }, res) {
        const { store_id } = params;
        const { page = 1, limit } = query;

        try {
            let data = await connection('orders')
                .join('clients', 'clients.clientId', 'orders.client_id')
                .join('users', 'clients.user_id', 'users.userId')
                .join('addresses', 'addresses.user_id', 'users.userId')
                .limit(limit)
                .offset(page * limit)
                .where('orders.store_id', store_id)
                .select('*');

            data = data.map(item => {
                return {
                    Id: item.orderId,
                    store_id: item.store_id,
                    delivery_id: item.delivery_id,

                    customer: {
                        userId: item.user_id,
                        cpf: item.cpf,
                        userName: item.userName,
                        email: item.email,
                        dateOfBirth: item.dateOfBirth,
                        address: {
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
                    payment: '', // make join
                    shipping: '', // make join
                    is_completed: '', // create database collumn for this field
                    items: item.shoppingCart,
                    deleted: item.deleted,
                    created_at: item.created_at,
                    updated_at: item.updated_at,
                };
            });

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

        try {
            const data = await getOrderById({res, connection, store_id, order_id});

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
