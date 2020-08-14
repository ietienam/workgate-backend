/* eslint-disable prettier/prettier */
const express = require('express');

const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

//PARAM MIDDLEWARE
//router.param('id', reviewController.checkID);
router.use(authController.protect);

router
  .route('/top-10-earners')
  .get(reviewController.aliasTop10Earners, reviewController.getAllReviews); //IN NIGERIA & INDIVIDUAL STATES

router
  .route('/average-location')
  .get(reviewController.getAverageSalaryByLocation);

router
  .route('/average-position-query')
  .get(reviewController.getAverageSalaryByPositionQuery);

router.route('/all-positions').get(reviewController.getAllPositions);

router.route('/average-remote').get(reviewController.getRemoteAverage);

router.route('/average-promoted').get(reviewController.getPromotedAverage);

router
  .route('/average-position')
  .get(reviewController.getAverageSalaryByPosition);

router
  .route('/average-experience')
  .get(reviewController.getAverageSalaryByYearsOfExperience);

router.route('/average-national').get(reviewController.getNationalAverage);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.setUserIds, reviewController.addReview);

//TODO: CHANGE TO GET REVIEWS THAT MATCH COMPANYNAME SEARCH
router.route('/:id').get(reviewController.getReview);

module.exports = router;
