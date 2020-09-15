const connection = require('../../../database/connection');
const { calculateShipping } = require('../../integrations/correios');

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
            const [data] = await connection('orders').where({
                store_id: store_id,
                id: id,
            });

            const { client_id } = data;

            const dataClient = await connection('users')
                .join('clients', 'users.id', 'clients.user_id')
                .join('addresses', 'addresses.user_id', 'users.id')
                .where({ 'clients.id': client_id, 'users.store_id': store_id })
                .select(
                    'clients.id',
                    'clients.user_id',
                    'users.store_id',
                    'users.avatar_id',

                    'clients.cpf',
                    'clients.dateOfBirth',

                    'users.name',
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
                    .join('products', 'products.id', 'variations.product_id')
                    .join('brands', 'products.id', 'brands.id')
                    .select(
                        'variations.id',

                        'brands.brand',
                        'variations.product_id',

                        'products.name',
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
                        'variations.id': `${item.variation_id}`,
                        'brands.store_id': store_id,
                    });
                itemProducts.push(...variation);
            }

            data.shoppingCart = itemProducts;

            let { zipcode } = data.client_id;

            zipcode = zipcode.replace(/\-/g, '');

            const [address] = await connection('stores')
                .join('addresses', 'addresses.id', 'stores.id') // need to create new fields for address store id
                .where({ 'stores.id': store_id });

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
