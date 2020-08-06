const connection = require('../../../database/connection');

export default async (req, res, next) => {
    const { user_id } = req.headers;

    if (!user_id) return res.status(401).json('this action needs a user');

    const { id } = req.params;

    const user = await connection('users')
        .select('*')
        .where('id', user_id);

    if (!user.length) {
        return res.status(401).json('user does not exist');
    }

    if (!user[0].permission.includes('admin')) {
        return res.status(401).json('user does not have administrator permission');
    }

    const store = await connection('stores')
        .select('*')
        .where('id', id);

    if (!store.length) {
        return res.status(401).json('not found');
    }

    if (user[0].store_id.toString() !== id) {
        return res.status(401).json('user does not have permission');
    }

    return next();
};
