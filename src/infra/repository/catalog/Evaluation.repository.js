const connection = require('../../database/connection');

class EvaluationRepository {
    async create({ payload, store_id }) {
        return await connection('evaluations')
            .returning('*')
            .insert({
                clientName,
                evaluationText,
                evaluationScore,
                store_id,
                product_id,
            });
    }

    async list({ page, store_id }) {
        return await connection('evaluations')
            .limit(10)
            .offset((parseInt(page) - 1) * 10)
            .where({ store_id })
            .select('*');
    }

    async getById({ id, store_id }) {
        return await connection('evaluations')
            .select('*')
            .where({ evaluationId: id, store_id });
    }

    async update({ payload, evaluation_id, store_id }) {
        return await connection('evaluations')
            .where({ evaluationId: evaluation_id, store_id })
            .update(payload, [
                'clientName',
                'evaluationText',
                'evaluationScore',
                'product_id',
            ]);
    }

    async delete({ evaluation_id, store_id }) {
        return await connection('evaluations')
            .where({ evaluationId: evaluation_id, store_id })
            .del();
    }
}

module.exports = new EvaluationRepository();
