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

// catalog
import CategoriesController from './app/controllers/catalog/categories/CategoriesController';
import InactiveCategoriesController from './app/controllers/catalog/categories/InactiveCategoriesController';
import BrandsController from './app/controllers/catalog/brands/BrandsController';
import EvaluationsController from './app/controllers/catalog/evaluations/EvaluationsController';
import ProductsController from './app/controllers/catalog/products/ProductsController';
import CategoryProductController from './app/controllers/catalog/category_products/CatProdController';
import VariationsController from './app/controllers/catalog/variations/VariationsController';
import ImagesController from './app/controllers/catalog/images/ImagesController';

// order

import AdminOrdersController from './app/controllers/order/OrdersAdminController';
import OrdersController from './app/controllers/order/OrdersClientController';

import DeliveryController from './app/controllers/order/DeliveryController';

import CardsController from './app/controllers/order/CardsController';

import CartsController from './app/controllers/order/CartsController';

import PaymentsController from './app/controllers/order/PaymentsController';

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

routes.post('/stores/:store_id/addresses', AddressController.store);
routes.get('/stores/:store_id/addresses', AddressController.findAll);
routes.get(
    '/stores/:store_id/addresses/:address_id',
    AddressController.findOne
);
routes.put('/stores/:store_id/addresses/:address_id', AddressController.update);
routes.delete(
    '/stores/:store_id/addresses/:address_id',
    AddressController.delete
);

/*
/* clients
*/

// clients
routes.post('/stores/:store_id/clients/:client_id', ClientController.store);
routes.put('/stores/:store_id/clients/:client_id', ClientController.update);
routes.delete('/stores/:store_id/clients/:client_id', ClientController.delete);

// admins
routes.get(
    '/stores/:store_id/clients',
    authMiddleware,
    storeValidation,
    AdminClientController.getClientsByStore
);

routes.get(
    '/stores/:store_id/clients/client_id',
    authMiddleware,
    storeValidation,
    AdminClientController.getOneClientByStore
);

routes.put(
    '/stores/:store_id/clients/client_id',
    authMiddleware,
    storeValidation,
    AdminClientController.updateOneClientByStore
);

routes.delete(
    '/stores/:store_id/clients/client_id',
    authMiddleware,
    storeValidation,
    AdminClientController.deleteOneClientByStore
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
routes.get('/stores/:store_id/categories', CategoriesController.getAll);
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

// product
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

// category product
routes.post(
    '/stores/:store_id/category_products',
    authMiddleware,
    storeValidation,
    CategoryProductController.store
);
routes.get('/category_products', CategoryProductController.getAll);
routes.delete('/category_products/:id', CategoryProductController.delete);

// variations

routes.post('/stores/:store_id/variations', VariationsController.store);
routes.get('/stores/:store_id/variations', VariationsController.findAll);
routes.get(
    '/stores/:store_id/variations/:variation_id',
    VariationsController.findOne
);
routes.put(
    '/stores/:store_id/variations/:variation_id',
    VariationsController.update
);
routes.delete(
    '/stores/:store_id/variations/:variation_id',
    VariationsController.delete
);

// evaluations

routes.post('/stores/:store_id/evaluations', EvaluationsController.store);
routes.get('/stores/:store_id/evaluations/', EvaluationsController.findAll);
routes.get(
    '/stores/:store_id/evaluations/:evaluation_id',
    EvaluationsController.findOne
);
routes.put(
    '/stores/:store_id/evaluations/:evaluation_id',
    EvaluationsController.update
);
routes.delete(
    '/stores/:store_id/evaluations/:evaluation_id',
    EvaluationsController.remove
);

routes.post('/images', upload.single('files'), ImagesController.store);

// orders admin

routes.get(
    '/stores/:store_id/ordersAdmin',
    authMiddleware,
    storeValidation,
    AdminOrdersController.findAll
);
routes.get(
    '/stores/:store_id/ordersAdmin/:id',
    authMiddleware,
    storeValidation,
    AdminOrdersController.findOne
);
routes.get(
    '/stores/:store_id/listOrdersByClient/:client_id',
    authMiddleware,
    storeValidation,
    AdminOrdersController.listOrdersByClient
);
routes.delete(
    '/stores/:store_id/ordersAdmin/:id',
    authMiddleware,
    storeValidation,
    AdminOrdersController.delete
);

// orders
routes.post('/stores/:store_id/orders',  authMiddleware, OrdersController.create);
routes.get('/stores/:store_id/orders/client/:client_id',  authMiddleware, OrdersController.findAll);
routes.get('/stores/:store_id/orders/:id',  authMiddleware, OrdersController.findOne);
routes.delete('/stores/:store_id/orders/:id',  authMiddleware, OrdersController.delete);

routes.post('/stores/:store_id/deliveries', DeliveryController.create);
routes.get('/stores/:store_id/deliveries', DeliveryController.findAll);

routes.post('/stores/:store_id/cards', CardsController.create);
routes.get('/stores/:store_id/cards', CardsController.findAll);

routes.post('/stores/:store_id/carts', CartsController.create);
routes.get('/stores/:store_id/carts', CartsController.findAll);

routes.post('/stores/:store_id/payments', PaymentsController.create);
routes.get('/stores/:store_id/payments', PaymentsController.findAll);

export default routes;
