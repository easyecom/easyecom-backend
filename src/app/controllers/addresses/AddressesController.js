const connection = require('../../../database/connection');

class AddressController {
    async store(req, res) {
        const { store_id } = req.params;

        const {
            zipcode,
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
            state_code,
            country,
            user_id,
        } = req.body;

        const errors = [
            'zipcode',
            'street',
            'number',
            'neighborhood',
            'city',
            'state_code',
            'country',
            'user_id',
            'store_id',
        ];
        const error = errors.filter(prop =>
            !req.body[prop] && !req.params[prop] ? prop : ''
        );

        if (error.length > 0) {
            return res
                .status(422)
                .json({ error: 'you forgot', required: error });
        }

        try {
            const data = await connection('addresses')
                .returning('*')
                .insert({
                    zipcode,
                    street,
                    number,
                    complement,
                    neighborhood,
                    city,
                    state,
                    state_code,
                    country,
                    user_id,
                    store_id,
                });
            return res.status(201).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async findAll(req, res) {
        const { store_id } = req.params;
        try {
            const data = await connection('addresses')
                .select('*')
                .where('store_id', store_id);

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
        }
    }

    async findOne(req, res) {
        const { store_id, address_id } = req.params;

        try {
            const data = await connection('addresses')
                .select('*')
                .where({ store_id, id: address_id });

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
        }
    }

    async update(req, res) {
        const { store_id, address_id } = req.params;
        const address = req.body;

        try {
            const data = await connection('addresses')
                .returning('*')
                .where({ store_id, id: address_id })
                .update(address, [
                    'zipcode',
                    'street',
                    'number',
                    'complement',
                    'neighborhood',
                    'city',
                    'state',
                    'state_code',
                    'country',
                    'user_id',
                ]);

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
        }
    }

    async delete(req, res) {
        const { store_id, address_id } = req.params;

        // make role that, if item is equal or less then one, dont permission delete
        try {
            await connection('addresses')
                .where({ store_id, id: address_id })
                .del();

            return res.status(200).json({ message: 'address delete success' });
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = new AddressController();
