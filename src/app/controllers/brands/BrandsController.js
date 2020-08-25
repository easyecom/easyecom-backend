import connection from '../../../database/connection';

class BrandsController {
    async store(req, res) {
        const { store_id } = req.params;
        const { name, description, isActive } = req.body;

        try {
            let error = [];

            if (!name) error.push('name');
            if (!store_id) error.push('store_id');
            if (!description) error.push('description');

            if (error.length > 0) {
                return res
                    .status(422)
                    .json({ error: 'you forgot', required: error });
            }

            const checkBrand = await connection('brands')
                .where('name', name)
                .select('*');

            if (checkBrand.length) {
                return res.status(400).json({
                    message: 'brand already exist',
                    brand: checkBrand,
                });
            }

            await connection('brands')
                .returning('*')
                .insert({
                    name,
                    description,
                    isActive,
                    store_id,
                });

            return res.status(201).json('brands performed successfully');
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }
    async getAll(req, res) {
        const { store_id } = req.params;

        try {
            const data = await connection('brands')
                .select('id', 'name', 'description')
                .where('store_id', store_id);

            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }
    async getOne(req, res) {
        try {
            const { brandId } = req.params;

            const data = await connection('brands')
                .where('id', brandId)
                .select('*');

            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }
    async update(req, res) {
        try {
            const { brandId } = req.params;
            const { name, description, isActive, store_id } = req.body;

            const data = await connection('brands')
                .where('id', brandId)
                .update({ name, description, isActive, store_id }, [
                    'name',
                    'description',
                    'isActive',
                    'store_id',
                ]);

            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }
    async delete(req, res) {
        try {
            const { brandId } = req.params;

            await connection('brands')
                .where('id', brandId)
                .del();

            return res
                .status(200)
                .json({ message: 'brand deleted successfully' });
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }
}

export default new BrandsController();
