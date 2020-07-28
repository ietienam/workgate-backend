/* eslint-disable prettier/prettier */
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signUp);

router.route('/login').post(authController.logIn);

router.route('/').get(authController.protect, userController.getAllUsers);

//TODO: REPLACE TO SEARCH BY NAME TO GET USERS THAT MATCH
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.editUser)
  .delete(
    authController.protect,
    authController.restrictTo(['admin']),
    userController.deleteUser
  );

module.exports = router;
