const app = require('./app');

const port = 3777;

app.listen(port, err => {
    if (err) console.error(err);
    console.log(`running port ${port}`);
});
