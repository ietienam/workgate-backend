/* eslint-disable prettier/prettier */
const Review = require('../models/reviewModel');

module.exports = {
  getAllReviews: async (req, res) => {
    try {
      //BUILD QUERY
      //1A) FILTERING
      const queryObj = { ...req.query };
      const excludedFields = ['page', 'limit', 'fields'];
      excludedFields.forEach(el => { delete queryObj[el] });

      //1B) ADVANCED FILTERING
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

      // PERFORM GET REQUEST
      let query = Review.find(JSON.parse(queryStr));

      //2) SORTING
      if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
      } else {
        query = query.sort('-createdAt');
      }

      const reviews = await query;

      res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
          reviews
        },
      });
    } catch (error) {
      res.status(404).json({
        status: 'fail',
        message: error
      });
    }
  },

  getReview: async (req, res) => {
    //TODO: CHANGE TO GET REVIEWS THAT MATCHES SEARCH PARAMETERS
    //E.G COMPANYNAME, LOCATION, CURRENTsALARY, POSITION, E.T.C
    //E.G FIND REVIEWS IN ABUJA WITH SALARY >= 150K
    try {
      const review = await Review.findById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: {
          review
        },
      });
    } catch (error) {
      res.status(404).json({
        status: 'fail',
        message: error
      });
    }
  },

  addReview: async (req, res) => {
    //const newReview = new Review({data goes here!});
    //newReview.save();

    try {
      const newReview = await Review.create(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          review: newReview
        },
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: 'Invalid data set',
      });
    }
  },
};
