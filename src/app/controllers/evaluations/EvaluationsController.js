import connection from '../../../database/connection';

class EvaluationsController {
    async store(req, res) {
        const { store_id } = req.params;
        const {
            evaluation,
            evaluationText,
            evaluationScore,
            product_id,
        } = req.body;

        let error = [];

        if (!evaluation) error.push('evaluation');
        if (!evaluationText) error.push('evaluationText');
        if (!evaluationScore) error.push('evaluationScore');
        if (!store_id) error.push('store_id');
        if (!product_id) error.push('product_id');

        if (error.length > 0) {
            return res
                .status(402)
                .json({ error: 'you forgot', required: error });
        }

        try {
            const data = await connection('evaluations')
                .returning('*')
                .insert({
                    evaluation,
                    evaluationText,
                    evaluationScore,
                    store_id,
                    product_id,
                });

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
                .where({ store_id: store_id, id: evaluation_id });

            return res.status(200).json(data);
        } catch (err) {
            return console.error(err);
        }
    }

    async update(req, res) {
        const { store_id, evaluation_id } = req.params;
        const evaluation = req.body;

        try {
            const data = await connection('evaluations')
                .where({ store_id: store_id, id: evaluation_id })
                .update(evaluation, [
                    'evaluation',
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
            .where({ store_id: store_id, id: evaluation_id })
            .del();

        return res.status(200).json({ message: 'evaluation deleted success' });
    }
}

export default new EvaluationsController();
