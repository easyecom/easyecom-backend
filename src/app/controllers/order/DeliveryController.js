import connection from '../../../database/connection';

class DeliveryController {
    async create(req, res) {
        const { store_id } = req.params;
        const {
            status,
            tracking,
            type,
            cost,
            deliveryTime,
            address_id,
        } = req.body;

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
}

export default new DeliveryController();
