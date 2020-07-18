import connection from '../../../database/connection';

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
                error: 'set your email',
                success: null,
            });
        }
        const user = await connection('users')
            .where({ email })
            .select('*')
            .first();

        if (!user) {
            return res.render('recovery', {
                error: 'email not exist',
                success: null,
            });
        }

        const tokenRecoveryPssword = () => {
            const recovery = [];
            const token = crypto.randomBytes(16).toString('hex');
            const date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
            recovery.push({ token, date });
            return recovery;
        };

        const recoveryData = tokenRecoveryPssword();

        // criar campo recovery e armazenar dados no banco para recuperar token e liberar criação de nova senha
        // após o recebimento do mesmo que será enviado por email ao cliente
        return res.json(recoveryData);
    }
}

export default new RecoveryController();
