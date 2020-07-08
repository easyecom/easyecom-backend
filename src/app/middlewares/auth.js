import jwt from 'express-jwt';
import secret from '../../config/auth';

function getTokenFromHeaders(req, res) {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'not authorization' });
        }
        const token = req.headers.authorization.split(' ');

        if (token[0] === 'Bearer') {
            return res.status(401).json({ message: 'not authorization' });
        }
        return token[1];
    } catch (err) {
        return res.status(401).json({ error: 'Token invalid' });
    }
}

const auth = {
    required: jwt({
        secret,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret,
        userProperty: 'payload',
        credentialsRequired: false,
        getToken: getTokenFromHeaders,
    }),
};

export default auth;
