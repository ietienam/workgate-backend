/* eslint-disable prettier/prettier */
const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)

//TODO: REPLACE TO SEARCH BY NAME TO GET USERS THAT MATCH
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.editUser)

module.exports = router;
