const bcrypt = require('bcryptjs');

module.exports = payload => {
    // return payload
    const user = new Promise((resolve, reject) => {
        try {
            bcrypt.hash(String(payload.password), 7, (err, hash) => {
                payload.password = hash;
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                resolve(payload);
            });
        } catch (err) {
            console.error(err);
            return { error: true };
            // return res.status(500).json({
            //     statusCode: 500,
            //     message: 'sorry, something broke...',
            // });
        }
    });

    user.then(result => {
        return result; //res.status(201).send(result);
    }).catch(err => {
        console.error(err);
        return { error: true }; //res.status(500).json('sorry, something broke...');
    });

    return user;
};
