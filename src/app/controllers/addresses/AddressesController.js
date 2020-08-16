import connection from '../../../database/connection';

class AddressController {
    async store(req, res) {
        try {
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
                store_id,
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
}

export default new AddressController();
