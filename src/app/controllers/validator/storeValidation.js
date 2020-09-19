const connection = require('../../../database/connection');

module.exports = async (req, res, next) => {
    const { store_id } = req.params;
    const { user_admin } = req.headers;

    if (!user_admin)
        return res
            .status(400)
            .json({ message: 'include a valid administrator' });

    if (store_id == 0 || !store_id || !store_id.length) {
        return res.status(400).json({ message: 'include a valid store' });
    }

    const user = await connection('users')
        .select('*')
        .where('userId', user_admin);

    if (!user.length) {
        return res.status(404).json('user does not exist');
    }

    if (!user[0].permission.includes('admin')) {
        return res.status(403).json('administrator not have permission');
    }

    const store = await connection('stores')
        .select('*')
        .where('storeId', store_id);

    if (!store.length) {
        return res.status(404).json('store does not exist');
    }

    if (user[0].store_id.toString() !== store_id) {
        return res.status(403).json('store administrator not have permmission');
    }

    return next();
};
