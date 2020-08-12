import connection from '../../../database/connection';

class BrandsController {
    async store(req, res) {
        const { name, description, isActive, store_id } = req.body;

        try {
            let error = [];

            if (!name) error.push('name');
            if (!isActive) error.push('isActive');
            if (!store_id) error.push('store_id');
            if (!description) error.push('description');

            if (error.length > 0) {
                return res
                    .status(422)
                    .json({ error: 'you forgot', required: error });
            }

            await connection('brands')
                .returning('id')
                .insert({
                    name,
                    isActive,
                    store_id,
                    description,
                });

            return res.status(201).json('brands performed successfully');
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }
}

export default new BrandsController();
