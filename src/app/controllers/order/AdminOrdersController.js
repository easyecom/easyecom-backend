import connection from '../../../database/connection';

class AdminOrdersController {
    async findAll(req, res) {
        const data = await connection('orders');

        return res.status(200).json(data);
    }

    async findOne({ params }, res) {
        const { id } = params;

        const data = await connection('orders').where('id', id);
        return res.status(200).json(data);
    }

    async delete({ params }, res) {
        const { id } = params;

        await connection('orders')
            .where('id', id)
            .del();
        return res.status(200).json({ message: 'order deleted success' });
    }
}

export default new AdminOrdersController();
