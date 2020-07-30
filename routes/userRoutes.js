/* eslint-disable prettier/prettier */
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.logIn);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router.patch('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateMe', authController.protect, userController.updateMe);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  );

router
  .route('/:id')
  .get(userController.getUser)
  .patch(authController.protect, userController.editUser)
  .delete(
    authController.protect,
    authController.restrictTo(['admin']),
    userController.deleteUser
  );

module.exports = router;
