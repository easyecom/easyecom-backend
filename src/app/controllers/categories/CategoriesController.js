import connection from '../../../database/connection';

class CategoriesController {
    async store(req, res) {
        const { name, isActive, store_id, products } = req.body;

        try {
            let error = [];

            if (!name) error.push('name');
            if (!isActive) error.push('isActive');
            if (!store_id) error.push('store_id');
            if (!products) error.push('products');

            if (error.length > 0) {
                return res
                    .status(422)
                    .json({ error: 'you forgot', required: error });
            }

            await connection('categories')
                .returning('id')
                .insert({
                    name,
                    isActive,
                    store_id,
                    products,
                });

            return res.status(201).json('categories performed successfully');
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }
}

export default new CategoriesController();
