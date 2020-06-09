import { Router } from 'express';

import ProductController from './app/controllers/ProductController';

const routes = new Router();

routes.post('/products', ProductController.create);
routes.get('/products', ProductController.getAll);
routes.get('/products/:id', ProductController.getById);

export default routes;
