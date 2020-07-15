import { Router } from 'express';
import multer from 'multer';
import authMiddleware from './app/middlewares/auth';

import multerConfig from './config/multer';

import UsersController from './app/controllers/UsersController';
import SessionController from './app/controllers/SessionController';
import AvatarController from './app/controllers/AvatarController';
import recoveryController from './app/controllers/recoveryController';
import recoveredController from './app/controllers/recoveredController';

const routes = new Router();
const upload = multer(multerConfig);

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

routes.get('/recovery', recoveryController.showRecovery);
routes.post('/recovery', recoveryController.createRecovery);
routes.get('/recovered', recoveredController.showCompleteRecovery);
routes.post('/recovered', recoveredController.completeRecovery);

export default routes;
