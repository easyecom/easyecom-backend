import app from './app';

require('dotenv').config();

app.disable('x-powered-by');

app.set('view engine', 'ejs');

const { PORT } = process.env;

app.listen(PORT, err => {
    if (err) throw err;
    console.log(`running port ${PORT}`);
});
