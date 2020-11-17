const multer = require('multer');
const CategoriesController = require('../app/controllers/catalog/categories/CategoriesController');
const BrandsController = require('../app/controllers/catalog/brands/BrandsController');
const EvaluationsController = require('../app/controllers/catalog/evaluations/EvaluationsController');
const ProductsController = require('../app/controllers/catalog/products/ProductsController');
const PricesController = require('../app/controllers/catalog/prices/PricesController');
const StocksController = require('../app/controllers/catalog/stocks/StocksController');

const SearchProductsController = require('../app/controllers/catalog/products/searchProductsController');
const CategoryProductController = require('../app/controllers/catalog/category_products/CatProdController');
const VariationsController = require('../app/controllers/catalog/variations/VariationsController');
const ImagesController = require('../app/controllers/catalog/images/ImagesController');

const authMiddleware = require('../app/middlewares/auth');
const storeValidation = require('../app/controllers/validator/storeValidation');

const multerConfig = require('../config/multer');

const upload = multer(multerConfig);

module.exports = routes => {
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
    routes.get(
        '/stores/:store_id/products/:product_id',
        ProductsController.getOne
    );
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

    // category product for dev
    routes.post(
        '/stores/:store_id/category_products',
        authMiddleware,
        storeValidation,
        CategoryProductController.store
    );
    routes.get('/category_products', CategoryProductController.getAll);
    routes.delete('/category_products/:id', CategoryProductController.delete);

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
        upload.single('file'),
        authMiddleware,
        storeValidation,
        ImagesController.store
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
};
