const connection = require('../../../database/connection');
const { calculateShipping } = require('../../integrations/correios');

class OrdersController {
    async create(req, res) {
        const { store_id } = req.params;
        const { shoppingCart, delivery_id, cancel, client_id } = req.body; // criar delivery no momento do pedido
        // const { client_id } = req.headers;

        try {
            const [checkClient] = await connection('clients').where(
                'clientId',
                client_id
            );

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

            const [checkDelivery] = await connection('deliveries').where({
                deliveryId: delivery_id,
                store_id: store_id,
            });

            // if (!checkDelivery) {
            //     return res.status(404).json({ message: 'delivery not exist' });
            // }

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
        const { store_id, order_id } = params;

        try {
            const [data] = await connection('orders').where({
                store_id: store_id,
                order_id: order_id,
            });

            const { client_id } = data;

            const dataClient = await connection('users')
                .join('clients', 'users.userId', 'clients.user_id')
                .join('addresses', 'addresses.user_id', 'users.userId')
                .where({ 'clients.clientId': client_id, 'users.store_id': store_id })
                .select(
                    'clients.clientId',
                    'clients.user_id',
                    'users.store_id',
                    'users.avatar_id',

                    'clients.cpf',
                    'clients.dateOfBirth',

                    'users.userName',
                    'users.email',

                    'addresses.zipcode',
                    'addresses.street',
                    'addresses.number',
                    'addresses.complement',
                    'addresses.neighborhood',
                    'addresses.city',
                    'addresses.state',
                    'addresses.state_code',
                    'addresses.country',

                    'users.permission',

                    'clients.created_at',
                    'clients.updated_at'
                );

            [data.client_id] = dataClient;

            let itemProducts = [];

            for (let item of data.shoppingCart) {
                let variation = await connection('variations')
                    .join('products', 'products.productId', 'variations.product_id')
                    .join('brands', 'products.productId', 'brands.brandId')
                    .select(
                        'variations.variationId',

                        'brands.brandName',
                        'variations.product_id',

                        'products.productName',
                        'variations.title',
                        'variations.freeShipping',
                        'variations.offerPrice',
                        'variations.salesPrice',
                        'variations.weightKg',
                        'variations.packagedLength',
                        'variations.packagedHeight',
                        'variations.packagedWidth'
                    )
                    .where({
                        'products.store_id': store_id,
                        'variations.store_id': store_id,
                        'variations.variationId': `${item.variation_id}`,
                        'brands.store_id': store_id,
                    });
                itemProducts.push(...variation);
            }

            data.shoppingCart = itemProducts;

            let { zipcode } = data.client_id;

            zipcode = zipcode.replace(/\-/g, '');

            const [address] = await connection('stores')
                .join('addresses', 'addresses.addressId', 'stores.storeId') // need to create new fields for address store id
                .where({ 'stores.storeId': store_id });

            const storeZipcode = address.zipcode.replace(/\-/g, '');

            let [freight] = await calculateShipping(
                data.shoppingCart,
                zipcode,
                storeZipcode
            );

            data.freightValue = {
                code: freight.Codigo,
                value: freight.Valor,
                deliveryTime: freight.PrazoEntrega,
                deliverySaturday: freight.EntregaSabado,
                messageError: freight.MsgErro,
            };

            return res.status(200).json(data);
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
