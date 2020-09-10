import connection from '../../../database/connection';

class OrdersController {
    async create(req, res) {
        const { store_id } = req.params;
        const { client_id, delivery_id } = req.body;

        const data = await connection('orders')
            .returning('*')
            .insert({
                client_id,
                delivery_id,
                store_id,
            });

        return res.status(201).json(data);
    }

    async findAll({ params }, res) {
        const { store_id, client_id } = params;

        const data = await connection('orders').where({
            store_id: store_id,
            client_id: client_id,
        });

        return res.status(200).json(data);
    }

    async findOne({ params }, res) {
        const { store_id, id } = params;

        const data = await connection('orders').where({
            store_id: store_id,
            id: id,
        });

        return res.status(200).json(data);
    }

    async delete({ params }, res) {
        const { store_id, id } = params;

        await connection('orders')
            .where('id', id)
            .del();

        return res.status(200).json({ message: 'order deleted success' });
    }
}

export default new OrdersController();
