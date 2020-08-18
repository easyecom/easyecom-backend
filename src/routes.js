import { Router } from 'express';
import multer from 'multer';
import authMiddleware from './app/middlewares/auth';
import storeValidation from './app/controllers/validator/storeValidation';

import multerConfig from './config/multer';

// user
import UsersController from './app/controllers/users/UsersController';
import SessionController from './app/controllers/users/SessionController';
import AvatarController from './app/controllers/users/AvatarController';
import RecoveryController from './app/controllers/users/RecoveryController';
import RecoveredController from './app/controllers/users/RecoveredController';

// store
import StoresController from './app/controllers/stores/StoresController';
import AddressController from './app/controllers/addresses/AddressesController';
import ClientController from './app/controllers/clients/ClientController';
import AdminClientController from './app/controllers/clients/AdminClientController';
import CategoriesController from './app/controllers/categories/CategoriesController';
import InactiveCategoriesController from './app/controllers/categories/InactiveCategoriesController';
import BrandsController from './app/controllers/brands/BrandsController';
import EvaluationsController from './app/controllers/evaluations/EvaluationsController';
import ProductsController from './app/controllers/products/ProductsController';
import VariationsController from './app/controllers/variations/VariationsController';
import ImagesController from './app/controllers/images/ImagesController';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/recovery', RecoveryController.showRecovery);
routes.post('/recovery', RecoveryController.createRecovery);
routes.get('/recovered', RecoveredController.showCompleteRecovery);
routes.post('/recovered', RecoveredController.completeRecovery);

routes.post('/users', UsersController.store);
routes.get('/users', UsersController.getAll);
routes.get('/users/:id', authMiddleware, UsersController.getOne);
routes.put('/users/:id', authMiddleware, UsersController.update);
routes.delete('/users/:id', authMiddleware, UsersController.delete);

routes.post('/session', SessionController.create);

routes.post(
    '/avatar',
    upload.single('file'),
    authMiddleware,
    AvatarController.store
);
routes.get('/avatar', AvatarController.getAll);
routes.get('/avatar/:id', authMiddleware, AvatarController.getOne);
routes.delete('/avatar/:id', authMiddleware, AvatarController.delete);

routes.post('/stores', authMiddleware, StoresController.store);
routes.get('/stores', authMiddleware, StoresController.getAll);
routes.get('/stores/:store_id', authMiddleware, StoresController.getOne);
routes.put(
    '/stores/:store_id',
    authMiddleware,
    storeValidation,
    StoresController.update
);
routes.delete(
    '/stores/:store_id',
    authMiddleware,
    storeValidation,
    StoresController.delete
);

routes.post('/addresses', AddressController.store);

/*
/* clients
*/

routes.post('/clients', ClientController.store);
routes.delete('/clients/:id', ClientController.delete);

routes.get(
    '/clients/stores/:store_id',
    authMiddleware,
    storeValidation,
    AdminClientController.getClientsByStore
);

routes.get(
    '/client/stores/:store_id',
    authMiddleware,
    storeValidation,
    AdminClientController.getOneClientByStore
);

/*
/* catalog 
*/

// active category
routes.post(
    '/stores/:store_id/categories',
    authMiddleware,
    storeValidation,
    CategoriesController.store
);
routes.get('/categories', CategoriesController.getAll);
routes.get('/categories/:category_id', CategoriesController.getOne);
routes.put(
    '/stores/:store_id/categories/:category_id',
    authMiddleware,
    storeValidation,
    CategoriesController.update
);
routes.delete(
    '/stores/:store_id/categories/:category_id',
    authMiddleware,
    storeValidation,
    CategoriesController.delete
);

// inactive category (just admin)
routes.get(
    '/stores/:store_id/inactive-categories',
    authMiddleware,
    storeValidation,
    InactiveCategoriesController.getAll
);
routes.get(
    '/stores/:store_id/inactive-categories/:inactive_categoriesId',
    authMiddleware,
    storeValidation,
    InactiveCategoriesController.getOne
);
routes.put(
    '/stores/:store_id/inactive-categories/:inactive_categoriesId',
    authMiddleware,
    storeValidation,
    InactiveCategoriesController.update
);
routes.delete(
    '/stores/:store_id/inactive-categories/:inactive_categoriesId',
    authMiddleware,
    storeValidation,
    InactiveCategoriesController.delete
);

// brands
routes.post(
    '/stores/:store_id/brands',
    authMiddleware,
    storeValidation,
    BrandsController.store
);
routes.get('/stores/:store_id/brands', BrandsController.getAll);
routes.get('/stores/:store_id/brands/:brandId', BrandsController.getOne);
routes.put(
    '/stores/:store_id/brands/:brandId',
    authMiddleware,
    storeValidation,
    BrandsController.update
);
routes.delete(
    '/stores/:store_id/brands/:brandId',
    authMiddleware,
    storeValidation,
    BrandsController.delete
);

routes.post(
    '/stores/:store_id/products',
    authMiddleware,
    storeValidation,
    ProductsController.store
);

routes.get('/stores/:store_id/products', ProductsController.getAll);

routes.get('/stores/:store_id/products/:product_id', ProductsController.getOne);

routes.put(
    '/stores/:store_id/products/:product_id',
    authMiddleware,
    storeValidation,
    ProductsController.update
);

routes.delete(
    '/stores/:store_id/products/:product_id',
    authMiddleware,
    storeValidation,
    ProductsController.delete
);

export default routes;
