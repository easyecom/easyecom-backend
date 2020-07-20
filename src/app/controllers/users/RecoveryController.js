import connection from '../../../database/connection';
import emailTemplateRecovery from '../../../../helpers/emailRecovery';

const crypto = require('crypto');

class RecoveryController {
    async showRecovery(req, res, next) {
        return res.render('recovery', {
            error: null,
            success: null,
        });
    }

    async createRecovery(req, res) {
        const { email } = req.body;
        if (!email) {
            return res.render('recovery', {
                error: 'Ops, acho que você esqueceu o seu email',
                success: null,
            });
        }
        const user = await connection('users')
            .where({ email })
            .select('*')
            .first();

        if (!user) {
            return res.render('recovery', {
                error: 'email does not exist',
                success: null,
            });
        }

        const token = crypto.randomBytes(16).toString('hex');

        const date = new Date();

        date.setHours(date.getHours() + 24);

        const data = await connection('users')
            .where('id', user.id)
            .update({ recoveryToken: token, recoveryExpireToken: date }, [
                'recoveryToken',
                'recoveryExpireToken',
            ]);

        await emailTemplateRecovery(
            { user, token },
            (error = null, success = null) => {
                return res.render('recovery', { error, success });
            }
        );

        if (!data.length) {
            return res.status(404).json({ message: 'user does not exist' });
        }

        return res.status(200).json(data);
    }
}

export default new RecoveryController();
