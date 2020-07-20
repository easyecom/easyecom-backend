const transporter = require('nodemailer').createTransport(
    require('../src/config/mail')
);

const baseURL = 'http://localhost:3777';

module.exports = ({ user, token }, cb) => {
    const message = `
        <h1 style="text-align: center;> recuperação de senha </h1>
        <br />
        <p>Acesse o link para redefinir a sua senha.</p>
        <a href: "${baseURL}/recovered?token=${token}">
            ${baseURL}/recovered?token=${token}
        </a>
        <br /><br /><hr />  
        <p>
            Obs.: Se você não solicitou a redefinicao, apenas ignore esse email.
        </p>
        <br />
        <p>Atenciosamente, Ecommerce Sid Surf Store</p>
    `;

    const optionEmail = {
        from: 'naoresponda@gmail.com',
        to: user.email,
        subject: 'Redefinição de senha - Sid Surf Store',
        html: message,
    };

    if (process.env.NODE_ENV === 'production') {
        transporter.sendMail(optionEmail, (error, info) => {
            if (error) {
                console.log(error);
                return cb(
                    'Aconteceu um erro no envio do email, tente novamente.'
                );
            }
            return cb(
                null,
                'Link para redefinicao de senha foi enviado com sucesso para seu email.'
            );
        });
    }
    console.log(optionEmail);
    return cb(
        null,
        'Link para redefinicao de senha foi enviado com sucesso para seu email.'
    );
};
