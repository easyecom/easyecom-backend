const transporter = require('nodemailer').createTransport(
    require('../src/main/config/mail')
);

const baseURL = 'http://localhost:3777';

module.exports = ({ user, token }, cb) => {
    const message = `
        <h1 style="text-align: center;> Recuperação de senha </h1>
        <br />
        <p>Acesse o link para redefinir a sua senha.</p>
        <a href: "${baseURL}/recovered?token=${token}">
            ${baseURL}/recovered?token=${token}
        </a>
        <br /><br /><hr />  
        <p>
            Obs.: Caso você nao tenha solicitado essa redefinicao, apenas ignore esse email.
        </p>
        <br />
        <p>Atenciosamente, Ecommerce Sid Surf Store</p>
    `;

    const optionEmail = {
        from: 'naoresponda@sidsurfstore.com.br',
        to: user.email,
        subject: 'Redefinição de senha - Sid Surf Store',
        html: message,
    };

    if (process.env.NODE_ENV === 'production') {
        transporter.sendMail(optionEmail, (error, info) => {
            if (error) {
                console.log(error);
                return cb(
                    'Ocorreu um erro no envio do email, tente novamente.'
                );
            }
            return cb(
                null,
                'O link para redefinir sua senha foi enviado para seu email.'
            );
        });
    }
    console.log(optionEmail);
    return cb(
        null,
        'O link para redefinir sua senha foi enviado para seu email.'
    );
};
