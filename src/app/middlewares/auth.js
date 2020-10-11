const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const authConfig = require('../../config/auth');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    // return console.log(authHeader);
    if (!authHeader) {
        return res.status(401).json({ error: 'Token not provider' });
    }

    const [scheme, token] = authHeader.split(' ');

    if (!/^Bearer$/i.test(scheme)) {
        return res
            .status(401)
            .json({ error: { message: 'token malformatted' } });
    }

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);
        
        req.userId = decoded.payload.id;

        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token invalid' });
    }
};
