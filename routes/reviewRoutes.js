/* eslint-disable prettier/prettier */
const express = require('express');

const router = express.Router();
const reviewController = require('../controllers/reviewController');

//PARAM MIDDLEWARE
//router.param('id', reviewController.checkID);

router
  .route('/top-10-earners')
  .get(reviewController.aliasTop10Earners, reviewController.getAllReviews); //IN NIGERIA & INDIVIDUAL STATES

router
  .route('/review-stats')
  .get(reviewController.getReviewStats);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(reviewController.addReview);

//TODO: CHANGE TO GET REVIEWS THAT MATCH COMPANYNAME SEARCH
router
  .route('/:id')
  .get(reviewController.getReview)


module.exports = router;
