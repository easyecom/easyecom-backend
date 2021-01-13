const connection = require ('../../../infra/database/connection');

const bcrypt = require('bcryptjs');

class RecoveredController {
    async showCompleteRecovery(req, res, next) {
        try {
            if (!req.query.token) {
                return res.render('recovery', {
                    error: 'token not found',
                    success: null,
                });
            }

            const user = await connection('users')
                .where('recoveryToken', req.query.token)
                .select('*')
                .first();

            if (new Date() > user.recoveryExpireToken) {
                return res.render('recovery', {
                    error: 'Token expirado. Tente novamente.',
                    success: null,
                });
            }

            return res.render('recovery/store', {
                error: null,
                success: null,
                token: req.query.token,
            });
        } catch (err) {
            return console.error(err);
        }
    }

    async completeRecovery(req, res) {
   
        const { userId } = await connection('users')
        .where('recoveryToken', req.query.token)
        .select('*')
        .first();

        const { password } = req.body;

        const user = new Promise((resolve, reject) => {
            try {
                bcrypt.hash(String(password), 7, (err, hash) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(
                        connection('users')
                            .where('userId', userId)
                            .update({   password: hash,}, [
                                'password',
                            ])
      
                    );
                });
                return res.status(201).json('update success');

                } catch (err) {
                    console.error(err);
                    return res.status(500).json('sorry, something broke...');
                }
            });

            user.then(result => {
                console.log(result);
            }).catch(err => {
                console.error(err);
                return res.status(500).json('sorry, something broke...');
            });

        return res.json('hello');
    }
}

module.exports = new RecoveredController();
