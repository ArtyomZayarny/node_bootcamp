const userRouter = require('express').Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
userRouter.use(authController.protect);

userRouter.patch('/updatePassword/', authController.updatePassword);
userRouter.get('/me', userController.getMe, userController.getUser);
userRouter.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
userRouter.delete('/deleteMe', userController.deleteMe);

//  Admin protect
userRouter.use(authController.restrictTo('admin'));

userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
