import app from './app';

require('dotenv').config();

app.disable('x-powered-by');

const { PORT } = process.env;

app.listen(PORT, err => {
    if (err) throw err;
    console.log(`running port ${PORT}`);
});
