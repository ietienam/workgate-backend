/* eslint-disable prettier/prettier */
const express = require('express');

const router = express.Router();
const interviewController = require('../controllers/interviewController');

//PARAM MIDDLEWARE
//router.param('id', interviewController.checkID);

router
  .route('/')
  .get(interviewController.getAllInterviews)
  .post(interviewController.addInterview);

router
  .route('/:id')
  .get(interviewController.getInterview);

  //TODO: ADD ROUTE TO VIEW INTERVIEWS THAT MATCH COMPANYNAME SEARCH

module.exports = router;
