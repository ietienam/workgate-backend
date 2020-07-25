/* eslint-disable prettier/prettier */
const Review = require('../models/reviewModel');

const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports = {
  aliasTop10Earners: (req, res, next) => {
    req.query.limit = '10';
    req.query.sort = '-currentSalary';
    req.query.fields =
      'companyName,position,startingSalary,currentSalary,location'; //USER ONLY GETS THESE OPTIONS
    next();
  },

  getAllReviews: catchAsync(async (req, res, next) => {
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
  }),

  getReview: catchAsync(async (req, res, next) => {
    //TODO: CHANGE TO GET REVIEWS THAT MATCHES SEARCH PARAMETERS
    //E.G COMPANYNAME, LOCATION, CURRENTsALARY, POSITION, E.T.C
    //E.G FIND REVIEWS IN ABUJA WITH SALARY >= 150K
    const review = await Review.findById(req.params.id);
    if (!review) {
      return next(new AppError('No review found for this ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        review,
      },
    });
  }),

  addReview: catchAsync(async (req, res, next) => {
    //const newReview = new Review({data goes here!});
    //newReview.save();
    const newReview = await Review.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        review: newReview,
      },
    });
  }),

  getAverageSalaryByLocation: catchAsync(async (req, res, next) => {
    const stats = await Review.aggregate([
      //MATCH ALL DOCUMENTS WITH SALARY GTE 0
      {
        $match: { currentSalary: { $gte: 0 } },
      },
      {
        $group: {
          _id: { $toUpper: '$location' }, //RETURN DATA BY GROUP E.G BY '$LOCATION' OR '$POSITION' OR EXPERIENCE
          numOfReviews: { $sum: 1 }, //TOTAL NUMBER OF REVIEWS
          averageExperience: { $avg: '$yearsOfExperience' },
          averageSalary: { $avg: '$currentSalary' }, //NATIONAL AVERAGE
          averageRating: { $avg: '$rating' }, //NATIONAL AVERAGE
          minSalary: { $min: '$currentSalary' }, //NAYIONAL AVERAGE
          maxSalary: { $max: '$currentSalary' }, //NATIONAL AVERAGE
        },
      },
      {
        $sort: { averageSalary: -1 }, //HIGHEST SALARY IN PIPELINE AGGREGATION COMES FIRST
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
  }),

  getAverageSalaryByPosition: catchAsync(async (req, res, next) => {
    const stats = await Review.aggregate([
      //MATCH ALL DOCUMENTS WITH SALARY GTE 0
      {
        $match: { currentSalary: { $gte: 0 } },
      },
      {
        $group: {
          _id: { $toUpper: '$position' }, //RETURN DATA BY GROUP E.G BY '$LOCATION' OR '$POSITION' OR EXPERIENCE
          numOfReviews: { $sum: 1 }, //TOTAL NUMBER OF REVIEWS
          averageExperience: { $avg: '$yearsOfExperience' },
          averageSalary: { $avg: '$currentSalary' }, //NATIONAL AVERAGE
          averageRating: { $avg: '$rating' }, //NATIONAL AVERAGE
          minSalary: { $min: '$currentSalary' }, //NAYIONAL AVERAGE
          maxSalary: { $max: '$currentSalary' }, //NATIONAL AVERAGE
        },
      },
      {
        $sort: { averageSalary: -1 }, //HIGHEST SALARY IN PIPELINE AGGREGATION COMES FIRST
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
  }),

  getAllPositions: catchAsync(async (req, res, next) => {
    const positions = await Review.aggregate([
      {
        $match: { currentSalary: { $gte: 0 } }
      },
      {
        $group: {
          _id: '$position'
        }
      },
      {
        $addFields: { position: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        positions,
      },
    });
  }),

  getAverageSalaryByPositionQuery: catchAsync(async (req, res, next) => {
    const stats = await Review.aggregate([
      //MATCH ALL DOCUMENTS WITH SALARY GTE 0
      {
        $match: { position: req.query.position },
      },
      {
        $group: {
          _id: '$yearsOfExperience', //RETURN DATA BY GROUP E.G BY '$LOCATION' OR '$POSITION' OR EXPERIENCE
          numOfReviews: { $sum: 1 }, //TOTAL NUMBER OF REVIEWS
          averageSalary: { $avg: '$currentSalary' }, //NATIONAL AVERAGE
          averageRating: { $avg: '$rating' }, //NATIONAL AVERAGE
          minSalary: { $min: '$currentSalary' }, //NAYIONAL AVERAGE
          maxSalary: { $max: '$currentSalary' }, //NATIONAL AVERAGE
        },
      },
      {
        $sort: { averageSalary: -1 }, //HIGHEST SALARY IN PIPELINE AGGREGATION COMES FIRST
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
  }),

  getAverageSalaryByYearsOfExperience: catchAsync(async (req, res, next) => {
    const stats = await Review.aggregate([
      //MATCH ALL DOCUMENTS WITH SALARY GTE 0
      {
        $match: { currentSalary: { $gte: 0 } },
      },
      {
        $group: {
          _id: { $toUpper: '$yearsOfExperience' }, //RETURN DATA BY GROUP E.G BY '$LOCATION' OR '$POSITION' OR EXPERIENCE
          numOfReviews: { $sum: 1 }, //TOTAL NUMBER OF REVIEWS
          averageExperience: { $avg: '$yearsOfExperience' },
          averageSalary: { $avg: '$currentSalary' }, //NATIONAL AVERAGE
          averageRating: { $avg: '$rating' }, //NATIONAL AVERAGE
          minSalary: { $min: '$currentSalary' }, //NAYIONAL AVERAGE
          maxSalary: { $max: '$currentSalary' }, //NATIONAL AVERAGE
        },
      },
      {
        $sort: { averageSalary: -1 }, //HIGHEST SALARY IN PIPELINE AGGREGATION COMES FIRST
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
  }),

  getNationalAverage: catchAsync(async (req, res, next) => {
    const stats = await Review.aggregate([
      //MATCH ALL DOCUMENTS WITH SALARY GTE 0
      {
        $match: { currentSalary: { $gte: 0 } },
      },
      {
        $group: {
          _id: null, //GENERAL AVERAGE
          numOfReviews: { $sum: 1 }, //TOTAL NUMBER OF REVIEWS
          averageExperience: { $avg: '$yearsOfExperience' },
          averageSalary: { $avg: '$currentSalary' }, //NATIONAL AVERAGE
          averageRating: { $avg: '$rating' }, //NATIONAL AVERAGE
          minSalary: { $min: '$currentSalary' }, //NAYIONAL AVERAGE
          maxSalary: { $max: '$currentSalary' }, //NATIONAL AVERAGE
        },
      },
      {
        $sort: { averageSalary: -1 }, //HIGHEST SALARY IN PIPELINE AGGREGATION COMES FIRST
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
  }),

  getRemoteAverage: catchAsync(async (req, res, next) => {
    const stats = await Review.aggregate([
      //MATCH ALL DOCUMENTS WITH SALARY GTE 0
      {
        $match: { currentSalary: { $gte: 0 } },
      },
      {
        $group: {
          _id: { $toUpper: '$remote' }, //AGGREGATE BY FULLY OR PARTIAL OR NOT REMOTE
          numOfReviews: { $sum: 1 }, //TOTAL NUMBER OF REVIEWS
          averageExperience: { $avg: '$yearsOfExperience' },
          averageSalary: { $avg: '$currentSalary' }, //NATIONAL AVERAGE
          averageRating: { $avg: '$rating' }, //NATIONAL AVERAGE
          minSalary: { $min: '$currentSalary' }, //NAYIONAL AVERAGE
          maxSalary: { $max: '$currentSalary' }, //NATIONAL AVERAGE
        },
      },
      {
        $sort: { averageSalary: -1 }, //HIGHEST SALARY IN PIPELINE AGGREGATION COMES FIRST
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
  }),

  getPromotedAverage: catchAsync(async (req, res, next) => {
    const stats = await Review.aggregate([
      //MATCH ALL DOCUMENTS WITH SALARY GTE 0
      {
        $match: { currentSalary: { $gte: 0 } },
      },
      {
        $group: {
          _id: '$promoted', //AGGREGATE BY FULLY OR PARTIAL OR NOT REMOTE
          numOfReviews: { $sum: 1 }, //TOTAL NUMBER OF REVIEWS
          averageExperience: { $avg: '$yearsOfExperience' },
          averageSalary: { $avg: '$currentSalary' }, //NATIONAL AVERAGE
          averageRating: { $avg: '$rating' }, //NATIONAL AVERAGE
          minSalary: { $min: '$currentSalary' }, //NAYIONAL AVERAGE
          maxSalary: { $max: '$currentSalary' }, //NATIONAL AVERAGE
        },
      },
      {
        $sort: { averageSalary: -1 }, //HIGHEST SALARY IN PIPELINE AGGREGATION COMES FIRST
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
  }),
};
