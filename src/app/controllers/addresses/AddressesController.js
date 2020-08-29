import connection, { select, returning } from '../../../database/connection';

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

        let error = [];

        if (!zipcode) error.push('zipcode');
        if (!street) error.push('street');
        if (!number) error.push('number');
        if (!neighborhood) error.push('neighborhood');
        if (!city) error.push('city');
        if (!state_code) error.push('state_code');
        if (!country) error.push('country');
        if (!user_id && !store_id) error.push('User or Store');

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
                .where({ store_id: store_id, id: address_id });

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
                .where({ store_id: store_id, id: address_id })
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
                .where({ store_id: store_id, id: address_id })
                .del();

            return res.status(200).json({ message: 'address delete success' });
        } catch (err) {
            console.error(err);
        }
    }
}

export default new AddressController();
