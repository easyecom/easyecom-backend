const _ = require('lodash');
const connection = require('../../../infra/database/connection');

class DeliveryController {
    async create({ params, body }, res) {
        const { store_id } = params;

        const { deliveryStatus, tracking, type, cost, deadline, address_id } = body;

        const [checkAddress] = await connection('addresses').where(
            'addressId',
            address_id
        );

        if (!checkAddress) {
            return res.status(404).json({ message: 'address does not exist' });
        }

        try {
            const data = await connection('deliveries')
                .returning('*')
                .insert({
                    deliveryStatus,
                    tracking,
                    type,
                    cost,
                    deadline,
                    address_id,
                    store_id,
                });

            return res.status(201).json(data);
        } catch (err) {
            return console.log(err);
        }
    }

    async update({ params, body }, res) {
        const { store_id, delivery_id } = params;
        const delivery = body;

        try {
            const [checkDelivery] = await connection('deliveries').where({
                store_id,
                deliveryId: delivery_id,
            });

            // return res.json(checkDelivery);

            if (!checkDelivery) {
                return res
                    .status(400)
                    .json({ error: 'delivery does not have' });
            }

            const data = await connection('deliveries')
                .update(delivery, ['deliveryStatus', 'tracking'])
                .where({ store_id: store_id, deliveryId: delivery_id });

            return res.status(200).json(data);
        } catch (err) {
            return console.log(err);
        }
    }

    async list({ params }, res) {
        const { store_id } = params;

        const data = await connection('deliveries').where('store_id', store_id);

        return res.status(200).json(data);
    }

    async getById({ params }, res) {
        const { store_id, delivery_id } = params;

        const data = await connection('deliveries').where({
            store_id: store_id,
            deliveryId: delivery_id,
        });

        return res.status(200).json(data);
    }
}

module.exports = new DeliveryController();
