const connection = require('../../../database/connection');
const RequestValidator = require('../../../../helpers/error-validator');

class AddressController {
    async store(req, res) {
        const { store_id } = req.params;
        const { userId: user_id } = req;

        let {
            zipcode,
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
            state_code,
            country,
            storeIdToAddress,
        } = req.body;

        const [checkStore] = await connection('stores').where(
            'storeId',
            store_id
        );

        if (!checkStore) {
            return res.status(401).json({ message: 'store does not exist' });
        }

        const [checkUser] = await connection('users').where({
            userId: user_id,
            store_id,
        });

        if (!checkUser) {
            return res.status(401).json({ message: 'users does not exist' });
        }

        const checkAddresses = await connection('addresses').where({
            user_id,
            store_id,
        });

        const [checkedAddresses] = checkAddresses
            .map(item => {
                if (
                    item &&
                    item.zipcode == zipcode &&
                    item.street == street &&
                    item.number == number
                ) {
                    return item;
                }
            })
            .filter(item => item);

        if (checkedAddresses) {
            const data = await connection('addresses')
                .returning('*')
                .where({
                    store_id,
                    addressId: checkedAddresses.addressId,
                })
                .update(
                    {
                        zipcode,
                        street,
                        number,
                        complement,
                        neighborhood,
                        city,
                        state,
                        state_code,
                        country,
                    },
                    [
                        'zipcode',
                        'street',
                        'number',
                        'complement',
                        'neighborhood',
                        'city',
                        'state',
                        'state_code',
                        'country',
                    ]
                );
            return res.json(data);
        }

        const errors = [
            'zipcode',
            'street',
            'number',
            'neighborhood',
            'city',
            'state_code',
            'country',
            'store_id',
        ];
        const requestValidate = new RequestValidator(errors, req);
        const response = await requestValidate.check();

        if (response) {
            return res.status(response.status).json(response.json);
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
                    storeIdToAddress,
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
        const { userId: user_id } = req;

        try {
            const data = await connection('addresses')
                .select('*')
                .where({ user_id, store_id });

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
        }
    }

    async findOne(req, res) {
        const { store_id, address_id } = req.params;
        const { userId: user_id } = req;

        try {
            const data = await connection('addresses').where({
                user_id,
                addressId: address_id,
                store_id,
            });

            if (!data.length) {
                return res.status(403).json({
                    message: 'you not have permission',
                });
            }

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
        }
    }

    async update(req, res) {
        const { store_id, address_id } = req.params;
        const { userId: user_id } = req;
        const address = req.body;

        const checkAddress = await connection('addresses').where({
            addressId: address_id,
        });

        if (!checkAddress.length) {
            return res.status(400).json({ message: 'address does not exist' });
        }

        const checkUserAddress = await connection('addresses').where({
            addressId: address_id,
            user_id,
        });

        if (!checkUserAddress.length) {
            return res.status(403).json({
                message: 'not permission',
            });
        }

        try {
            const data = await connection('addresses')
                .returning('*')
                .where({ store_id, addressId: address_id })
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
                ]);

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
        }
    }

    async delete(req, res) {
        const { store_id, address_id } = req.params;
        const { userId: user_id } = req;

        const checkAddress = await connection('addresses').where({
            addressId: address_id,
        });

        if (!checkAddress.length) {
            return res.status(400).json({ message: 'address does not exist' });
        }

        const checkUserAddress = await connection('addresses').where({
            addressId: address_id,
            user_id,
        });

        if (!checkUserAddress.length) {
            return res.status(403).json({
                message: 'not permission',
            });
        }

        const checkUserAllAddress = await connection('addresses').where({
            user_id,
        });

        if (checkUserAllAddress.length < 2) {
            return res
                .status(400)
                .json({ message: 'register other address before' });
        }

        try {
            await connection('addresses')
                .where({ store_id, addressId: address_id })
                .del();

            return res.status(200).json({ message: 'address delete success' });
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = new AddressController();
