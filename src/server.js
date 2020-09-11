const app = require('./app');

require('dotenv').config();

app.disable('x-powered-by');

app.set('view engine', 'ejs');

const port = process.env.PORT || 3777;

app.listen(port, err => {
    if (err) throw err;
    console.log(`running port ${port}`);
});
