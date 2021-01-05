const { Router } = require('express');
const multer = require('multer');
const authMiddleware = require('../presentation/middlewares/auth');
const storeValidation = require('../presentation/controllers/validator/storeValidation');

const multerConfig = require('./config/multer');

// user
const UsersController = require('../presentation/controllers/users/UsersController');
const SessionController = require('../presentation/controllers/users/SessionController');
const AvatarController = require('../presentation/controllers/users/AvatarController');
const RecoveryController = require('../presentation/controllers/users/RecoveryController');
const RecoveredController = require('../presentation/controllers/users/RecoveredController');

// store
const StoresController = require('../presentation/controllers/stores/StoresController');
const AddressController = require('../presentation/controllers/addresses/AddressesController');
const ClientController = require('../presentation/controllers/clients/ClientController');
const AdminClientController = require('../presentation/controllers/clients/AdminClientController');

// catalog
const CategoriesController = require('../presentation/controllers/catalog/categories/CategoriesController');
const BrandsController = require('../presentation/controllers/catalog/brands/BrandsController');
const EvaluationsController = require('../presentation/controllers/catalog/evaluations/EvaluationsController');
const ProductsController = require('../presentation/controllers/catalog/products/ProductsController');
const PricesController = require('../presentation/controllers/catalog/prices/PricesController');
const StocksController = require('../presentation/controllers/catalog/stocks/StocksController');

const SearchProductsController = require('../presentation/controllers/catalog/products/searchProductsController');
const CategoryProductController = require('../presentation/controllers/catalog/category_products/CatProdController');
const brandProdController = require('../presentation/controllers/catalog/brand_products/brandProdController');
const VariationsController = require('../presentation/controllers/catalog/variations/VariationsController');
const ImagesController = require('../presentation/controllers/catalog/images/ImagesController');

// order
const AdminOrdersController = require('../presentation/controllers/order/OrdersAdminController');
const OrdersController = require('../presentation/controllers/order/OrdersClientController');
const DeliveryController = require('../presentation/controllers/deliveries/DeliveryController');
const calculateFreightController = require('../presentation/controllers/deliveries/CalculateFreightController');
const PaymentsController = require('../presentation/controllers/order/PaymentsController');

const routes = new Router();
const upload = multer(multerConfig);

// recovery
routes.get('/recovery', RecoveryController.showRecovery);
routes.post('/recovery', RecoveryController.createRecovery);
routes.get('/recovered', RecoveredController.showCompleteRecovery);
routes.post('/recovered', RecoveredController.completeRecovery);

// users
routes.post('/users', UsersController.store);
routes.get('/users/dev', UsersController.getAll);
routes.get('/users', authMiddleware, UsersController.getOne);
routes.put('/users', authMiddleware, UsersController.update);
routes.delete('/users', authMiddleware, UsersController.delete);

// session
routes.post('/session', SessionController.create);

// avatar
routes.post(
    '/stores/:store_id/avatar',
    upload.single('file'),
    authMiddleware,
    AvatarController.store
);
routes.get('/stores/:store_id/avatar', AvatarController.getAll); // for dev
routes.get(
    '/stores/:store_id/avatar/:id',
    authMiddleware,
    AvatarController.getOne
);
routes.delete(
    '/stores/:store_id/avatar/:id',
    authMiddleware,
    AvatarController.delete
);

// store
routes.post('/stores', StoresController.store);
routes.get('/stores/:store_id', StoresController.getById);
routes.get('/stores', authMiddleware, StoresController.getAll);
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

// address
routes.post(
    '/stores/:store_id/addresses',
    authMiddleware,
    AddressController.store
);
routes.get(
    '/stores/:store_id/addresses',
    authMiddleware,
    AddressController.findAll
);
routes.get(
    '/stores/:store_id/addresses/:address_id',
    authMiddleware,
    AddressController.findOne
);
routes.put(
    '/stores/:store_id/addresses/:address_id',
    authMiddleware,
    AddressController.update
);
routes.delete(
    '/stores/:store_id/addresses/:address_id',
    authMiddleware,
    AddressController.delete
);

// clients
routes.post(
    '/stores/:store_id/clients/',
    authMiddleware,
    ClientController.store
);
routes.put(
    '/stores/:store_id/clients/:client_id',
    authMiddleware,
    ClientController.update
);
routes.get('/stores/:store_id/clients', ClientController.findAll);
routes.get(
    '/stores/:store_id/clients/:client_id',
    authMiddleware,
    ClientController.findOne
);
routes.delete(
    '/stores/:store_id/clients/:client_id',
    authMiddleware,
    ClientController.delete
);

routes.get(
    '/stores/:store_id/clientsAdmin',
    // authMiddleware,
    // storeValidation,
    AdminClientController.getClientsByStore
);
routes.get(
    '/stores/:store_id/clientsAdmin/:client_id',
    // authMiddleware,
    // storeValidation,
    AdminClientController.getOneClientByStore
);
routes.put(
    '/stores/:store_id/clientsAdmin/:client_id',
    authMiddleware,
    storeValidation,
    AdminClientController.updateOneClientByStore
);
routes.delete(
    '/stores/:store_id/clientsAdmin/:client_id',
    authMiddleware,
    storeValidation,
    AdminClientController.deleteOneClientByStore
);

/*
/* catalog 
*/

// category
routes.post(
    '/stores/:store_id/categories',
    authMiddleware,
    storeValidation,
    CategoriesController.store
);
routes.get('/stores/:store_id/categories', CategoriesController.getAll);
routes.get(
    '/stores/:store_id/categories/:category_id',
    CategoriesController.getOne
);
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

// brands
routes.post(
    '/stores/:store_id/brands',
    authMiddleware,
    storeValidation,
    BrandsController.store
);
routes.get('/stores/:store_id/brands', BrandsController.getAll);
routes.get('/stores/:store_id/brands/:brand_id', BrandsController.getOne);
routes.put(
    '/stores/:store_id/brands/:brand_id',
    authMiddleware,
    storeValidation,
    BrandsController.update
);
routes.delete(
    '/stores/:store_id/brands/:brand_id',
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

routes.get(
    '/stores/:store_id/products/search/:search',
    SearchProductsController.search
);

// category product
routes.get(
    '/stores/:store_id/category/:category_id/products',
    CategoryProductController.getById
);

routes.get(
    '/stores/:store_id/brand/:brand_id/products',
    brandProdController.getById
);

// variations
routes.post(
    '/stores/:store_id/variations',
    authMiddleware,
    storeValidation,
    VariationsController.store
);
routes.get('/stores/:store_id/variations', VariationsController.findAll);
routes.get(
    '/stores/:store_id/variations/:variation_id',
    VariationsController.findOne
);
routes.put(
    '/stores/:store_id/variations/:variation_id',
    authMiddleware,
    storeValidation,
    VariationsController.update
);
routes.delete(
    '/stores/:store_id/variations/:variation_id',
    authMiddleware,
    storeValidation,
    VariationsController.delete
);

// prices

routes.put(
    '/stores/:store_id/prices',
    authMiddleware,
    storeValidation,
    PricesController.update
);

routes.get(
    '/stores/:store_id/prices',
    authMiddleware,
    storeValidation,
    PricesController.getAll
);

routes.get(
    '/stores/:store_id/prices/:price_id',
    authMiddleware,
    storeValidation,
    PricesController.getById
);

routes.delete(
    '/stores/:store_id/prices/:price_id',
    authMiddleware,
    storeValidation,
    PricesController.delete
);

// stock

routes.put(
    '/stores/:store_id/stocks',
    authMiddleware,
    storeValidation,
    StocksController.update
);

routes.get(
    '/stores/:store_id/stocks',
    authMiddleware,
    storeValidation,
    StocksController.getAll
);

routes.get(
    '/stores/:store_id/stocks/:stock_id',
    authMiddleware,
    storeValidation,
    StocksController.getById
);

routes.delete(
    '/stores/:store_id/stocks/:stock_id',
    authMiddleware,
    storeValidation,
    StocksController.delete
);

// images

routes.post(
    '/stores/:store_id/images',
    upload.any(),
    authMiddleware,
    storeValidation,
    ImagesController.store
);
routes.put(
    '/stores/:store_id/images/:id',
    upload.any(),
    authMiddleware,
    storeValidation,
    ImagesController.update
);
routes.get('/stores/:store_id/images', ImagesController.getAll);
routes.get('/stores/:store_id/images/:id', ImagesController.getOne);
routes.delete('/stores/:store_id/images/:id', ImagesController.delete);

// evaluations
routes.post(
    '/stores/:store_id/evaluations',
    authMiddleware,
    EvaluationsController.store
);
routes.get('/stores/:store_id/evaluations/', EvaluationsController.findAll);
routes.get(
    '/stores/:store_id/evaluations/:evaluation_id',
    EvaluationsController.findOne
);
routes.put(
    '/stores/:store_id/evaluations/:evaluation_id',
    authMiddleware,
    EvaluationsController.update
);
routes.delete(
    '/stores/:store_id/evaluations/:evaluation_id',
    authMiddleware,
    EvaluationsController.remove
);

// orders admin
routes.get(
    '/stores/:store_id/orders/admin',
    authMiddleware,
    storeValidation,
    AdminOrdersController.findAll
);
routes.get(
    '/stores/:store_id/orders/:order_id/admin',
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
    'stores/:store_id/orders/:order_id/admin',
    authMiddleware,
    storeValidation,
    AdminOrdersController.delete
);

// orders
routes.post(
    '/stores/:store_id/orders',
    authMiddleware,
    OrdersController.create
);
routes.get(
    '/stores/:store_id/orders/me',
    authMiddleware,
    OrdersController.findAll
);
routes.get(
    '/stores/:store_id/orders/me/:order_id',
    authMiddleware,
    OrdersController.findOne
);
routes.delete(
    '/stores/:store_id/orders/me/:order_id',
    authMiddleware,
    OrdersController.delete
);

// calculate freight
routes.post(
    '/stores/:store_id/calculateFreight/variationId/:variation_id',
    calculateFreightController.calculate
);

// delivery
routes.post('/stores/:store_id/deliveries/', DeliveryController.create);
routes.get(
    '/stores/:store_id/deliveries/:delivery_id',
    DeliveryController.getById
);
routes.get('/stores/:store_id/deliveries', DeliveryController.list);
routes.put(
    '/stores/:store_id/deliveries/:delivery_id',
    DeliveryController.update
);

// payment
routes.post('/stores/:store_id/payments', PaymentsController.create);
routes.get('/stores/:store_id/payments', PaymentsController.findAll);

module.exports = routes;
