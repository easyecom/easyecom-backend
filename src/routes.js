import { Router } from 'express';
import multer from 'multer';
import authMiddleware from './app/middlewares/auth';

import multerConfig from './config/multer';

import UsersController from './app/controllers/UsersController';
import SessionController from './app/controllers/SessionController';
import AvatarController from './app/controllers/AvatarController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UsersController.create);
routes.get('/users', UsersController.getAll);
routes.get('/users/:id', UsersController.getOne);
routes.put('/users/:id', authMiddleware, UsersController.update);
routes.delete('/users/:id', UsersController.delete);

routes.post('/session', SessionController.create);

routes.post('/avatar', upload.single('file'), AvatarController.create);
routes.get('/avatar', AvatarController.getAll);
routes.get('/avatar/:id', AvatarController.getOne);
routes.delete('/avatar/:id', AvatarController.delete);

export default routes;
