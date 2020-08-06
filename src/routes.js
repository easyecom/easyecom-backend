import { Router } from 'express';
import multer from 'multer';
import authMiddleware from './app/middlewares/auth';
import storeValidation from './app/controllers/validator/storeValidation';

import multerConfig from './config/multer';

import UsersController from './app/controllers/users/UsersController';
import SessionController from './app/controllers/users/SessionController';
import AvatarController from './app/controllers/users/AvatarController';
import RecoveryController from './app/controllers/users/RecoveryController';
import RecoveredController from './app/controllers/users/RecoveredController';
import StoresController from './app/controllers/stores/StoresController';

import AddressController from './app/controllers/addresses/addressesController';

import ClientController from './app/controllers/clients/ClientController';

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
routes.get('/stores/:id', authMiddleware, StoresController.getOne);
routes.put('/stores/:id', authMiddleware, storeValidation, StoresController.update);
routes.delete('/stores/:id', authMiddleware, storeValidation, StoresController.delete);

routes.post('/addresses', AddressController.store)

routes.post('/clients', ClientController.store)

export default routes;
