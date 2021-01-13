const StoresController = require('../app/controllers/stores/StoresController');
const AddressController = require('../app/controllers/addresses/AddressesController');
const ClientController = require('../app/controllers/clients/ClientController');
const AdminClientController = require('../app/controllers/clients/AdminClientController');
const authMiddleware = require('../app/middlewares/auth');
const storeValidation = require('../app/controllers/validator/storeValidation');

module.exports = routes => {
    routes.post('/stores', StoresController.store);
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
};
