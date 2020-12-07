const multer = require('multer');
const UsersController = require('../app/controllers/users/UsersController');
const SessionController = require('../app/controllers/users/SessionController');
const AvatarController = require('../app/controllers/users/AvatarController');
const RecoveryController = require('../app/controllers/users/RecoveryController');
const RecoveredController = require('../app/controllers/users/RecoveredController');
const authMiddleware = require('../app/middlewares/auth');
const multerConfig = require('../config/multer');

const upload = multer(multerConfig);

module.exports = routes => {
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
};
