/* eslint-disable prettier/prettier */
const express = require('express');

const router = express.Router();
const interviewController = require('../controllers/interviewController');
const authController = require('../controllers/authController');

//PARAM MIDDLEWARE
//router.param('id', interviewController.checkID);
router.use(authController.protect);

router
  .route('/')
  .get(interviewController.getAllInterviews)
  .post(
    authController.setUserIds,
    interviewController.addInterview
  );

router.route('/:id').get(interviewController.getInterview);

//TODO: ADD ROUTE TO VIEW INTERVIEWS THAT MATCH COMPANYNAME SEARCH

module.exports = router;
