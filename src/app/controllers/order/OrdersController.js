import connection from '../../../database/connection';

class OrdersController {
    async create(req, res) {
        const { store_id } = req.params;
        const { client_id, delivery_id, cancel } = req.body;

        const data = await connection('orders')
            .returning('*')
            .insert({
                client_id,
                delivery_id,
                cancel,
                store_id,
            });

        return res.status(201).json(data);
    }
}

export default new OrdersController();
