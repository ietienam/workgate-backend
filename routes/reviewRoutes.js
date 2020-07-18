const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.param('id', reviewController.checkID);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(reviewController.addReview);

//TODO: CHANGE TO GET REVIEWS THAT MATCH COMPANYNAME SEARCH
router
  .route('/:id')
  .get(reviewController.getReview)


module.exports = router;
