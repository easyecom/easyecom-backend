import connection from '../../../../database/connection';

class CategoriesController {
    async store(req, res) {
        const { store_id } = req.params;
        const { category, isActive, description } = req.body;

        try {
            let error = [];

            if (!category) error.push('category');
            if (!store_id) error.push('params store_id');
            if (!description) error.push('description');

            if (error.length > 0) {
                return res
                    .status(422)
                    .json({ error: 'you forgot', required: error });
            }

            const data = await connection('categories')
                .returning('*')
                .insert({
                    category,
                    description,
                    store_id
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
                .where('id', category_id);
            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }

    async update(req, res) {
        const { category_id, store_id } = req.params;
        const { category, isActive, description } = req.body;

        try {
            const data = await connection('categories')
                .where('id', category_id)
                .update({ category, isActive, store_id, description }, [
                    'category',
                    'isActive',
                    'store_id',
                    'description',
                ]);
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
                .where('id', category_id);
            return res.status(200).json('category deleted successfully');
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }
}

export default new CategoriesController();
