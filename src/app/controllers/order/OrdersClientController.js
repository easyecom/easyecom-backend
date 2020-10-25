const connection = require('../../../database/connection');
const { calculateShipping } = require('../../integrations/correios');
const getOrderById = require('../helpers/getOrderById');
const util = require('util');

class OrdersController {
    async create(req, res) {
        const { store_id } = req.params;
        const { shoppingCart, deliveryData, PaymentData, cancel } = req.body; // criar delivery no momento do pedido
        const { userId: user_id } = req;

        // return res.json(shoppingCart);

        try {
            // if (!ShoppingCartValidation(shoppingCart))
            //     return res.json(422).json({ error: 'Dados do carrinho invalido' });

            // if (!DeliveryValidation(shoppingCart, deliveryData))
            //     return res.json(422).json({ error: 'Dados de entrega invalido' });

            // if (!PaymentValidation(shoppingCart, PaymentData))
            //     return res.json(422).json({ error: 'Dados de pagamento invalido' });

            const [checkClient] = await connection('clients')
                .join('users', 'clients.user_id', 'users.userId')
                .where({ user_id });

            const { clientId: client_id } = checkClient;

            if (!checkClient) {
                return res
                    .status(404)
                    .json({ message: 'client does not exist' });
            }

            const [checkAddress] = await connection('addresses').where(
                'user_id',
                checkClient.user_id
            );

            if (!checkAddress) {
                return res
                    .status(404)
                    .json({ message: 'address does note exist' });
            }

            // if (!checkDelivery) {
            //     return res.status(404).json({ message: 'delivery not exist' });
            // }

            // const [checkDelivery] = await connection('deliveries').where({
            //     deliveryId: delivery_id,
            //     store_id: store_id,
            // });

            // const [checkPayment] = await connection('payments').where({
            //     paymentId: payment_id,
            //     store_id: store_id,
            // });

            // if (!checkPayment) {
            //     return res.status(404).json({ message: 'payment not exist' });
            // }

            let data = await connection('orders')
                .returning('*')
                .insert({
                    client_id,
                    shoppingCart,
                    cancel,
                    store_id,
                });

            return res.status(201).json(data);
        } catch (err) {
            const msg = err.message;
            console.error({ message: msg, stack: err.stack });
            if (msg.includes("destructure property 'clientId'")) {
                return res
                    .status(400)
                    .json({ message: 'client does not exist' });
            }
        }
    }

    async findAll(req, res) {
        const { store_id } = req.params;
        const { userId: user_id } = req;

        try {
            const [checkClient] = await connection('clients')
                .select('*')
                .where({
                    'clients.store_id': store_id,
                    'clients.user_id': user_id,
                });

            if (!checkClient) return { message: 'client does not exist' };

            const data = await connection('orders')
                .select('*')
                .where({
                    'orders.store_id': store_id,
                    'orders.client_id': checkClient.clientId,
                });

            if (!data.length) {
                return res.status(200).json({
                    message: 'Você ainda não tem nenhum pedido processado',
                });
            }

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

            return res.status(200).json({ order: data });
        } catch (err) {
            console.error(err);
        }
    }

    async delete({ params }, res) {
        const { store_id, order_id } = params;

        try {
            await connection('orders')
                .where({
                    'orders.store_id': store_id,
                    'orders.orderId': order_id,
                })
                .del();

            return res.status(200).json({ message: 'order deleted success' });
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = new OrdersController();
