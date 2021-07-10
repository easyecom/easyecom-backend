require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const routes = require('./routes');

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(
            cors({
                origin: 'http://localhost:8000'
            })
        );
        this.server.use(express.json());
        this.server.set('view engine', 'ejs');
        this.server.disable('x-powered-by');

        this.server.use(
            '/avatar',
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
        );
        this.server.use(
            '/images',
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
        );
    }

    routes() {
        this.server.use(routes);
    }
}

module.exports = new App().server;
