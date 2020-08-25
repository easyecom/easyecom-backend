import connection from '../../../database/connection';

class EvaluationsController {
    async store(req, res) {
        const { id: store_id } = req.params;
        const { name, text, score, product_id } = req.body;

        try {
            let error = [];

            if (!name) error.push('name');
            if (!text) error.push('text');
            if (!score) error.push('score');
            if (!store_id) error.push('store_id');
            if (!product_id) error.push('product_id');

            if (error.length > 0) {
                return res
                    .status(402)
                    .json({ error: 'you forgot', required: error });
            }

            console.log('1');

            const data = await connection('evaluations')
                .returning('*')
                .insert({
                    name,
                    text,
                    score,
                    store_id,
                    product_id,
                });

            console.log('2');

            return res.json(data);
        } catch (err) {
            return err;
        }
    }
    
}

export default new EvaluationsController();
