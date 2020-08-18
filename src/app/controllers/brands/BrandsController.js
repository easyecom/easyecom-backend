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
        try {
            const data = await connection('brands');
            return res.status(200).json(data);
        } catch (err) {
            return err;
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
            return err;
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
            return err;
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
                .json({ message: 'brand delete successfully' });
        } catch (err) {
            return err;
        }
    }
}

export default new BrandsController();
