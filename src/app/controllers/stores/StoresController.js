import connection from '../../../database/connection';

class StoresController {
    async store(req, res) {
        try {
            const { name, cnpj, email, businessPhone, cellPhone } = req.body;

            let error = [];

            if (!name) error.push('name');
            if (!cnpj) error.push('cnpj');
            if (!email) error.push('email');
            if (!businessPhone && !cellPhone) error.push('phone');

            if (error.length > 0) {
                return res
                    .status(422)
                    .json({ error: 'sorry, you forgot', required: error });
            }

            const checkCNPJ = await connection('stores')
            .select('*')
            .where('cnpj', cnpj);

        if (checkCNPJ.length) {
            return res.status(400).json('cnpj alredy exist');
        }

            const data = await connection('stores')
                .returning('*')
                .insert({
                    name,
                    cnpj,
                    email,
                    businessPhone,
                    cellPhone,
                });

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getAll(req, res) {
        try {
            const data = await connection('stores').select('*');

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getOne(req, res) {
        try {
            const { store_id } = req.params;

            const data = await connection('stores')
                .where('id', store_id)
                .select('*');

            if (!data.length) {
                return res
                    .status(404)
                    .json({ message: 'store does not exist' });
            }

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async update(req, res) {
        try {
            const { store_id } = req.params;
            const { name, cnpj, email, businessPhone, cellPhone } = req.body;

            const data = await connection('stores')
                .returning('*')
                .where('id', store_id)
                .update({ name, cnpj, email, businessPhone, cellPhone });

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    // not enable for user
    async delete(req, res) {
        try {
            const { store_id } = req.params;

            await connection('stores')
                .where('id', store_id)
                .del();

            return res.status(202).json({ message: 'deleted success' });
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
}

export default new StoresController();
