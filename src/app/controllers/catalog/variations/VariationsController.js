import connection from '../../../../database/connection';

class VariationsController {
    async store(req, res) {
        const { store_id } = req.params;

        const {
            variation,
            isActive,
            keyWords,
            title,
            descriptionShort,
            description,
            packagedHeight,
            packagedLength,
            packagedWidth,
            weightKg,
            freeShipping,
            amount,
            costPrice,
            offerPrice,
            salesPrice,
            product_id,
        } = req.body;

        try {
            let error = [];

            if (!variation) error.push('variation');
            if (!descriptionShort) error.push('descriptionShort');
            if (!salesPrice) error.push('salesPrice');

            if (error.length > 0) {
                return res
                    .status(402)
                    .json({ error: 'you forgot', required: error });
            }

            const checkVariation = await connection('variations')
                .select('*')
                .where({ variation: variation, store_id: store_id });

            if (checkVariation.length) {
                return res.status(400).json({
                    message: 'variation already exist with this name',
                });
            }

            await connection('variations')
                .returning('*')
                .insert({
                    variation,
                    isActive,
                    keyWords,
                    title,
                    descriptionShort,
                    description,
                    packagedHeight,
                    packagedLength,
                    packagedWidth,
                    weightKg,
                    freeShipping,
                    amount,
                    costPrice,
                    offerPrice,
                    salesPrice,
                    store_id,
                    product_id,
                });

            return res.status(201).json('variations performed successfully');
        } catch (err) {
            console.error(err);
        }
    }

    async findAll(req, res) {
        const { store_id } = req.params;

        try {
            const data = await connection('variations')
                .select('*')
                .where('store_id', store_id);

            return res.status(200).json(data);
        } catch (err) {
            return console.error(data);
        }
    }

    async findOne(req, res) {
        const { store_id, variation_id } = req.params;

        try {
            const data = await connection('variations')
                .select('*')
                .where({ store_id: store_id, id: variation_id });

            return res.status(200).json(data);
        } catch (err) {
            return console.error(err);
        }
    }

    async update(req, res) {
        const { store_id, variation_id } = req.params;
        const variation = req.body;

        try {
            const data = await connection('variations')
                .returning('*')
                .where({ store_id: store_id, id: variation_id })
                .update(variation, [
                    'variation',
                    'isActive',
                    'keyWords',
                    'title',
                    'descriptionShort',
                    'description',
                    'packagedHeight',
                    'packagedLength',
                    'packagedWidth',
                    'weightKg',
                    'freeShipping',
                    'amount',
                    'costPrice',
                    'offerPrice',
                    'salesPrice',
                    'store_id',
                    'product_id',
                ]);

            return res.status(200).json(data);
        } catch (err) {
            return console.error({ message: err.message, stack: err.stack });
        }
    }

    async delete(req, res) {
        const { store_id, variation_id } = req.params;

        // make role that, if item is equal or less then one, dont permission delete

        try {
            await connection('variations')
                .where({ store_id: store_id, id: variation_id })
                .del();

            return res
                .status(200)
                .json({ message: 'variation deleted success' });
        } catch (err) {
            return console.error(err);
        }
    }
}

export default new VariationsController();
