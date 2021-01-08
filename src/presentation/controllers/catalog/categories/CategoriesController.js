const CategoryService = require('../../../../domain/services/category.service');

class CategoriesController {
    async store({ body: categories, params }, res) {
        const { store_id } = params;
        try {
            const results = await CategoryService.create({
                payload: categories,
                store_id,
            });

            if (results.method == 'update')
                return res.status(200).json(results);

            if (results.error)
                return res.status(400).json({
                    statusCode: 400,
                    message: `missing data ${results.error}`,
                });

            return res.status(201).json(results);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getAll({ params, query }, res) {
        try {
            const { store_id } = params;
            const { page } = query;

            const results = await CategoryService.list({
                payload: page,
                store_id,
            });

            if (!results.length) {
                return res
                    .status(400)
                    .json({ statusCode: 400, message: 'without category' });
            }

            return res.status(200).json(results);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getOne(req, res) {
        const { store_id, category_id } = req.params;

        try {
            const results = await CategoryService.getById({
                id: category_id,
                store_id,
            });

            if (!results.length) {
                return res
                    .status(400)
                    .json({ statusCode: 400, message: 'without category' });
            }

            return res.status(200).json(results[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async update({ body, params }, res) {
        const { category_id, store_id } = params;

        try {
            const results = await CategoryService.update({
                payload: body,
                category_id,
                store_id,
            });

            if (results.error)
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Categoria não existe',
                });

            if (!results) {
                return res
                    .status(404)
                    .json({ warn: 'category does not exist' });
            }

            return res.status(200).json(results);
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }

    async delete({ params }, res) {
        const { category_id, store_id } = params;

        try {
            const results = await CategoryService.delete({
                category_id,
                store_id,
            });

            if (results.error)
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Categoria não existe',
                });

            return res.status(200).json({
                statusCode: 200,
                message: `category deleted successfully`,
            });
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }
}

module.exports = new CategoriesController();
