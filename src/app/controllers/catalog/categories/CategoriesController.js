const connection = require('../../../../database/connection');

class CategoriesController {
    async store(req, res) {
        const { store_id } = req.params;
        const { categoryName, description, refId, products } = req.body;

        try {
            let error = [];

            if (!categoryName) error.push('categoryName');
            if (!store_id) error.push('params store_id');
            if (!description) error.push('description');

            if (error.length > 0) {
                return res
                    .status(400)
                    .json({ error: 'missing data', required: error });
            }

            const checkStore = await connection('stores').where(
                'storeid',
                store_id
            );
            
            if (!checkStore) {
                return res
                    .status(404)
                    .json({ message: 'store does not exist' });
            }

            const data = await connection('categories')
                .returning('*')
                .insert({
                    categoryName,
                    description,
                    refId,
                    products,
                    store_id,
                });

            return res.status(201).json(data);
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getAll(req, res) {
        try {
            const { store_id } = req.params;

            const data = await connection('categories')
                .select('*')
                .where({ isActive: true, store_id: store_id });

            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getOne(req, res) {
        const { category_id } = req.params;

        try {
            const data = await connection('categories')
                .select('*')
                .where('categoryId', category_id);
            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }

    async update(req, res) {
        const { category_id, store_id } = req.params;
        const {
            categoryName,
            isActive,
            description,
            products,
            refId,
        } = req.body;

        try {
            const data = await connection('categories')
                .where('categoryId', category_id)
                .update(
                    {
                        categoryName,
                        isActive,
                        description,
                        products,
                        store_id,
                        refId,
                    },
                    [
                        'categoryName',
                        'isActive',
                        'description',
                        'products',
                        'store_id',
                        'refId',
                    ]
                );
            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }

    async delete(req, res) {
        const { category_id } = req.params;

        try {
            await connection('categories')
                .del()
                .where('categoryId', category_id);
            return res.status(200).json('category deleted successfully');
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }
}

module.exports = new CategoriesController();
