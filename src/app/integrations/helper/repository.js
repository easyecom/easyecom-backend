const axios = require('axios').default;
const { baseUrl } = require('../../../config/pagseguro');

module.exports = body => {
    return axios
        .post(`${baseUrl}/charges`, body, {
            headers: {
                Authorization: '9D3C5D6F23A94740AE28675BDBB2BA67',
                ['Content-Type']: 'application/json',
                ['x-api-version']: '4.0',
            },
        })
        .then(({ data }) => {
            return console.log(data);
        })
        .catch(err => console.error(err));
};
