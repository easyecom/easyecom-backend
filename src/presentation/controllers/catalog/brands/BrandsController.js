const BrandService = require('../../../../domain/services/catalog/Brand.service');

class BrandsController {
    async store({ body: brands, params }, res) {
        const { store_id } = params;
        try {
            const results = await BrandService.create({
                payload: brands,
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
    async list({ params, query }, res) {
        try {
            const { store_id } = params;
            const { page } = query;

            const results = await BrandService.list({
                payload: page,
                store_id,
            });

            if (!results.length) {
                return res
                    .status(400)
                    .json({ statusCode: 400, message: 'without brand' });
            }

            return res.status(200).json(results);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
    async getById({ params }, res) {
        const { store_id, brand_id } = params;

        try {
            const [results] = await BrandService.getById({
                brandId: brand_id,
                store_id,
            });

            if (!results) {
                return res
                    .status(400)
                    .json({ statusCode: 400, message: 'without brand' });
            }

            return res.status(200).json(results);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
    async update({ body, params }, res) {
        const { brand_id, store_id } = params;

        try {
            const results = await BrandService.update({
                payload: body,
                brandId: brand_id,
                store_id,
            });

            if (results.error)
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Marca não existe',
                });

            if (!results) {
                return res.status(404).json({ warn: 'brand does not exist' });
            }

            return res.status(200).json(results);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
    async delete({ params }, res) {
        const { brand_id, store_id } = params;

        try {
            const results = await BrandService.delete({
                brandId: brand_id,
                store_id,
            });

            if (results.error)
                return res.status(400).json({
                    statusCode: 400,
                    message: 'marca não existe',
                });

            return res.status(200).json({
                statusCode: 200,
                message: `brand deleted successfully`,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
}

module.exports = new BrandsController();
