const connection = require('../../../database/connection');
const _ = require('lodash');
const { createPayment } = require('../../integrations/pagseguro');
const paymentResponse = require('./helpers/paymentResponse');

const getOrderById = require('./helpers/getOrderById');
const util = require('util');

class OrdersController {
    async create(req, res) {
        const { store_id } = req.params;
        const { shoppingCart, deliveryData, paymentData, cancel } = req.body; // criar delivery no momento do pedido
        const { userId: user_id } = req;

        try {
            // 1 - validate
            // if (!ShoppingCartValidation(shoppingCart))
            //     return res.json(422).json({ error: 'Dados do carrinho invalido' });

            // if (!DeliveryValidation(shoppingCart, deliveryData))
            //     return res.json(422).json({ error: 'Dados de entrega invalido' });

            // if (!PaymentValidation(shoppingCart, PaymentData))
            //     return res.json(422).json({ error: 'Dados de pagamento invalido' });

            // verificar se cliente está logado ou realizando o cadastro no momento da compra

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
                    .json({ message: 'address does not exist' });
            }

            // 2 - delivery
            const { cost, deliveryTime, type, addressDelivery } = deliveryData;

            let createAddressdelivery;
            if (addressDelivery.zipcode) {
                const {
                    zipcode,
                    street,
                    number,
                    complement,
                    neighborhood,
                    city,
                    state,
                    state_code,
                    country,
                } = addressDelivery;

                createAddressdelivery = await connection('addresses')
                    .returning('*')
                    .insert({
                        zipcode,
                        street,
                        number,
                        complement,
                        neighborhood,
                        city,
                        state,
                        state_code,
                        country,
                        user_id,
                        store_id,
                    });
            }

            let [data] = await connection('orders')
                .returning('*')
                .insert({
                    client_id,
                    shoppingCart,
                    cancel,
                    store_id,
                });

            // delivery
            if (!deliveryData) {
                return res.status(404).json({ message: 'delivery not exist' });
            }

            await connection('deliveries')
                .returning('*')
                .insert({
                    status: 'aguardando aprovação',
                    tracking: '',
                    type,
                    cost,
                    deliveryTime,
                    address_id:
                        createAddressdelivery &&
                        createAddressdelivery[0] &&
                        createAddressdelivery[0].addressId
                            ? createAddressdelivery[0].addressId
                            : checkAddress.addressId,
                    store_id,
                    order_id: data.orderId,
                });

            // payment
            if (!paymentData) {
                return res.status(404).json({ message: 'payment not exist' });
            }

            const responsePayment = await createPayment(
                paymentData,
                checkClient,
                checkAddress
            );

            await connection('payments')
                .returning('*')
                .insert({
                    status: responsePayment && responsePayment.status,
                    value: paymentData.value,
                    paymentForm: paymentData.paymentForm,
                    installment: paymentData.installment,
                    address_id: checkAddress.addressId,
                    cards: [
                        {
                            cardToken_1:
                                _.get(
                                    responsePayment,
                                    'payment_method.card.id'
                                ) &&
                                _.get(responsePayment, 'payment_method.type') ==
                                    'CREDIT_CARD'
                                    ? responsePayment.payment_method.card.id
                                    : undefined,
                            boleto:
                                _.get(responsePayment, 'links[0].href') &&
                                _.get(responsePayment, 'payment_method.type') ==
                                    'BOLETO'
                                    ? responsePayment.links[0].href
                                    : undefined,
                        },
                    ],
                    store_id,
                    order_id: data.orderId,
                    deliveryAddressEqualBilling: true,
                });

            data.paymentResponse = await paymentResponse(responsePayment, _);

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
            const message = error.message;
            if (message.includes(" property 'clientId' of checkClient")) {
                return res.status(400).json({ error: 'client not exist' });
            }
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
