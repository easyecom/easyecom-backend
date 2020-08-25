import connection from '../../../database/connection';

class VariationsController {
    async store(req, res) {
        const { id: store_id } = req.params;
        const {
            name,
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

            if (!name) error.push('name');
            if (!descriptionShort) error.push('descriptionShort');
            if (!salesPrice) error.push('salesPrice');

            if (error.length > 0) {
                return res
                    .status(402)
                    .json({ error: 'you forgot', required: error });
            }

            await connection('variations')
                .returning('*')
                .insert({
                    name,
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
                    product_id
                });

            return res.status(201).json('variations performed successfully');
        } catch (err) {
            return err;
        }
    }
}

export default new VariationsController();
