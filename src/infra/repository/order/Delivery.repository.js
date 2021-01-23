const connection = require('../../database/connection');

class DeliveryRepository {
    async create({ payload, store_id }) {
        return await connection('deliveries')
            .returning('*')
            .insert({
                deliveryStatus: payload.deliveryStatus,
                tracking: payload.tracking,
                type: payload.type,
                cost: payload.cost,
                deadline: payload.deadline,
                address_id: payload.address_id,
                store_id,
            });
    }

    async list({ page, store_id }) {
        return await connection('deliveries')
            .limit(10)
            .offset((parseInt(page) - 1) * 10)
            .where({ store_id })
            .select('*');
    }

    async getById({ id, store_id }) {
        return await connection('deliveries').where({
            store_id,
            deliveryId: id,
        });
    }

    async update({ delivery_id, store_id }) {
        return await connection('deliveries')
            .update(delivery, ['deliveryStatus', 'tracking'])
            .where({ store_id, deliveryId: delivery_id });
    }
}

module.exports = new DeliveryRepository();
