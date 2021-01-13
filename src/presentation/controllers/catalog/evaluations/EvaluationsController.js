const connection = require('../../../../infra/database/connection');

class EvaluationsController {
    async store(req, res) {
        const { store_id } = req.params;
        const {
            clientName,
            evaluationText,
            evaluationScore,
            product_id,
        } = req.body;

        let error = [];

        if (!clientName) error.push('clientName');
        if (!evaluationText) error.push('evaluationText');
        if (!evaluationScore) error.push('evaluationScore');
        if (!store_id) error.push('store_id');
        if (!product_id) error.push('product_id');

        if (error.length > 0) {
            return res
                .status(400)
                .json({ error: 'missing data', required: error });
        }

        const checkStore = await connection('stores').where({
            storeId: store_id,
        });

        if (!checkStore.length) {
            return res
                .status(404)
                .json({ error: { message: 'store does not exist' } });
        }

        try {
            const [data] = await connection('evaluations')
                .returning('*')
                .insert({
                    clientName,
                    evaluationText,
                    evaluationScore,
                    store_id,
                    product_id,
                });

            let evaluations = [];

            const [product] = await connection('products').where({
                productId: product_id,
                store_id,
            });

            evaluations.push(...product.evaluations, data.evaluationId);

            const [newProductArray] = await connection('products')
                .where({ productId: product_id, store_id })
                .update({ evaluations }, [evaluations]);
            console.table(newProductArray);

            return res.status(201).json(data);
        } catch (err) {
            return console.error({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    async findAll(req, res) {
        const { store_id } = req.params;

        try {
            const data = await connection('evaluations')
                .select('*')
                .where('store_id', store_id);

            return res.status(200).json(data);
        } catch (err) {
            return console.error(err);
        }
    }

    async findOne(req, res) {
        const { store_id, evaluation_id } = req.params;

        try {
            const data = await connection('evaluations')
                .select('*')
                .where({ store_id: store_id, evaluationId: evaluation_id });

            return res.status(200).json(data);
        } catch (err) {
            return console.error(err);
        }
    }

    async update(req, res) {
        const { store_id, evaluation_id } = req.params;
        const clientName = req.body;

        try {
            const data = await connection('evaluations')
                .where({ store_id: store_id, evaluationId: evaluation_id })
                .update(clientName, [
                    'clientName',
                    'evaluationText',
                    'evaluationScore',
                    'product_id',
                ]);

            return res.status(200).json(data);
        } catch (err) {
            return console.error(err);
        }
    }

    async remove(req, res) {
        const { store_id, evaluation_id } = req.params;
        await connection('evaluations')
            .where({ store_id: store_id, evaluationId: evaluation_id })
            .del();

        return res.status(200).json({ message: 'evaluation deleted success' });
    }
}

module.exports = new EvaluationsController();
