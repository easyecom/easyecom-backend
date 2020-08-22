import connection, { returning } from '../../../database/connection';

class Category_product_controller {
    async store(req, res) {
        const { category_id, product_id } = req.body;

        let error = [];

        if (!category_id) error.push('category_id');
        if (!product_id) error.push('product_id');

        if (error.length) {
            return res.status(400).json({ message: 'error', required: error });
        }

        try {
            const data = await connection('categorie_products')
                .returning('*')
                .insert({
                    category_id,
                    product_id,
                });

            return res.status(201).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getAll(req, res) {
        try {
            const data = await connection('categorie_products').select('*');

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async delete(req, res) {
        const { id } = req.params;
        try {
            await connection('categorie_products')
                .where('id', id)
                .del();
            return res.status(200).json({ message: 'product removed success' });
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
}

export default new Category_product_controller();
