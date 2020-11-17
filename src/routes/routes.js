const { Router } = require('express');
const userRouter = require('./userRoutes');
const catalogRouter = require('./catalogRoutes');
const storerRouter = require('./storeRoutes');
const orderRouter = require('./orderRoutes');

const routes = new Router();

userRouter(routes);
catalogRouter(routes);
storerRouter(routes);
orderRouter(routes);
module.exports = routes;
