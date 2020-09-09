import connection from '../../../database/connection';

class AdminOrdersController {
    async findAll({ params }, res) {
        const { store_id } = params;

        try {
            const data = await connection('orders')
                .where('store_id', store_id)
                .select('id', 'client_id', 'delivery_id', 'store_id', 'cancel');

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
        }
    }

    async listOrdersByClient({ params }, res) {
        const { store_id, client_id } = params;

        try {
            const data = await connection('orders')
                .where({
                    client_id: client_id,
                    store_id: store_id,
                })
                .select('id', 'client_id', 'delivery_id', 'store_id', 'cancel');
            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
        }
    }

    async findOne({ params }, res) {
        const { store_id, id } = params;

        try {
            const data = await connection('orders')
                .where({
                    id: id,
                    store_id: store_id,
                })
                .select('id', 'client_id', 'delivery_id', 'store_id', 'cancel');
            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
        }
    }

    async delete({ params }, res) {
        const { store_id, id } = params;

        try {
            await connection('orders')
                .where({ id: id, store_id: store_id })
                .del();
            return res.status(200).json({ message: 'order deleted success' });
        } catch (err) {
            console.error(err);
        }
    }
}

export default new AdminOrdersController();
