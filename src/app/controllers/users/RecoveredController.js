class RecoveredController {
    async showCompleteRecovery(req, res, next) {
        if (!req.params.token) {
            return res.render('recovery', {
                error: 'token not found',
                success: null,
            });
        }

        // const completeData = finishRecoveryPassword();
        //
        // if (!user)
        //    return res.render('recovery', {
        //        error: 'Não existe usuário com este token',
        //        success: null,
        //    });
        // if (new Date(date) < new Date())
        //    return res.render('recovery', {
        //        error: 'Token expirado. Tente novamente.',
        //        success: null,
        //    });
        // return res.render('recovery/store', {
        //    error: null,
        //    success: null,
        //    token: req.query.token,
        // });
    }

    async completeRecovery() {
        return 'hello';
    }
}

export default new RecoveredController();

// const finishRecoveryPassword = () => {
//    this.recovery = { token: null, date: null };
//    return this.recovery;
// };
