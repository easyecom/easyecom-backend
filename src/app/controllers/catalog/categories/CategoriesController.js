const connection = require('../../../../database/connection');
const defaultImages = require('../helpers/defaultImages');

class CategoriesController {
    async store(req, res) {
        const { store_id } = req.params;
        const {
            categoryName,
            description,
            refId,
            isActive,
            products,
        } = req.body;

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
                'storeId',
                store_id
            );

            if (!checkStore) {
                return res
                    .status(404)
                    .json({ message: 'store does not exist' });
            }

            const [data] = await connection('categories')
                .returning('*')
                .insert({
                    categoryName,
                    description,
                    refId,
                    isActive,
                    products: [],
                    store_id,
                });

            await defaultImages(data, connection);

            return res.status(201).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getAll(req, res) {
        try {
            const { store_id } = req.params;

            let data = await connection('categories')
                .select('*')
                .where({ isActive: true, store_id });

            if (!data.length) {
                return res.status(404).json({ warn: 'without category' });
            }

            return res.status(200).json({ categories: data });
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getOne(req, res) {
        const { store_id, category_id } = req.params;

        try {
            const data = await connection('categories')
                .join('images', 'images.category_id', 'categories.categoryId')
                .select('*')
                .where({
                    categoryId: category_id,
                    'categories.store_id': store_id,
                });

            data.map(item => {
                item.image = `http://localhost:3777/images/${item.name}`;
            });

            if (!data.length) {
                return res.status(404).json({ warn: 'without category' });
            }

            return res.status(200).json(data[0]);
        } catch (err) {
            console.error(err);
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

            if (!data.length) {
                return res
                    .status(404)
                    .json({ warn: 'category does not exist' });
            }

            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }

    async delete(req, res) {
        const { category_id } = req.params;

        try {
            const checkCategory = await connection('categories')
                .select('*')
                .where('categoryId', category_id);

            if (!checkCategory.length) {
                return res
                    .status(404)
                    .json({ warn: 'category does not exist' });
            }

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
