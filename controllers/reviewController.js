/* eslint-disable prettier/prettier */
const Review = require('../models/reviewModel');

const APIFeatures = require('../utils/apiFeatures');

module.exports = {
  aliasTop10Earners: (req, res, next) => {
    req.query.limit = '10';
    req.query.sort = '-currentSalary';
    req.query.fields =
      'companyName,position,startingSalary,currentSalary,location'; //USER ONLY GETS THESE OPTIONS
    next();
  },

  getAllReviews: async (req, res) => {
    try {
      //EXECUTE QUERY
      const features = new APIFeatures(Review.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const reviews = await features.query;

      res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
          reviews,
        },
      });
    } catch (error) {
      res.status(404).json({
        status: 'fail',
        message: error,
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
          review,
        },
      });
    } catch (error) {
      res.status(404).json({
        status: 'fail',
        message: error,
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
          review: newReview,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: 'Invalid data set',
      });
    }
  },

  getReviewStats: async (req, res) => {
    try {
      const stats = await Review.aggregate([
        //MATCH ALL DOCUMENTS WITH SALARY GTE 0
        {
          $match: { currentSalary: { $gte: 0 } }
        },
        {
          $group: {
            _id: { $toUpper: '$location' }, //RETURN DATA BY GROUP E.G BY '$LOCATION' OR '$POSITION' OR EXPERIENCE
            numOfReviews: { $sum: 1 }, //TOTAL NUMBER OF REVIEWS
            averageExperience: { $avg: '$yearsOfExperience' },
            averageSalary: { $avg: '$currentSalary' }, //NATIONAL AVERAGE
            averageRating: { $avg: '$rating' }, //NATIONAL AVERAGE
            minSalary: { $min: '$currentSalary' }, //NAYIONAL AVERAGE
            maxSalary: { $max: '$currentSalary' } //NATIONAL AVERAGE
          }
        },
        {
          $sort: { averageSalary: -1 } //HIGHEST SALARY IN PIPELINE AGGREGATION COMES FIRST
        },
        /*//SHOW DOCUMENTS WITH LOCATION NOT EQUAL TO ABUJA
        {
          $match: { _id: { $ne: 'ABUJA' } }
        },*/
      ]);
      res.status(200).json({
        status: 'success',
        data: {
          stats,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: 'Invalid data set',
      });
    }
  }
};
