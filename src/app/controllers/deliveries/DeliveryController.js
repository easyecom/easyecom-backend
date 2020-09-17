const { identity } = require('lodash');
const connection = require('../../../database/connection');

class DeliveryController {
    async create({ params, body }, res) {
        const { store_id } = params;

        const { status, tracking, type, cost, deliveryTime, address_id } = body;

        const [checkAddress] = await connection('addresses').where(
            'id',
            address_id
        );

        if (!checkAddress) {
            return res.status(400).json({ message: 'address does not exist' });
        }

        try {
            const data = await connection('deliveries')
                .returning('*')
                .insert({
                    status,
                    tracking,
                    type,
                    cost,
                    deliveryTime,
                    address_id,
                    store_id,
                });

            return res.status(201).json(data);
        } catch (err) {
            return console.log(err);
        }
    }

    async findAll({ params }, res) {
        const { store_id } = params;

        const data = await connection('deliveries').where('store_id', store_id);

        return res.status(200).json(data);
    }
}

module.exports = new DeliveryController();
