module.exports = {
    baseUrl:
        process.env.NODE_ENV === 'production'
            ? 'https://ws.pagseguro.uol.com.br/v2'
            : 'https://sandbox.api.pagseguro.com',
    sandbox_email:
        process.env.NODE_ENV === 'production'
            ? null
            : 'c31689544840453223091@sandbox.pagseguro.com.br',
    email: 'thiagocarvalho.ads@gmail.com',
    token: '9D3C5D6F23A94740AE28675BDBB2BA67',
};
