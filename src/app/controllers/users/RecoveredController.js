import connection from '../../../database/connection';

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
        const { token, password } = req.body;
        console.log(token);
        console.log(password);
        return res.json('hello');
    }
}

export default new RecoveredController();
