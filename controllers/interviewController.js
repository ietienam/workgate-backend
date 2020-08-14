/* eslint-disable prettier/prettier */
const Interview = require('../models/interviewModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports = {
  getAllInterviews: catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Interview.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const interviews = await features.query.select('-user');

    res.status(200).json({
      status: 'success',
      results: interviews.length,
      data: {
        interviews,
      },
    });
  }),

  getInterview: catchAsync(async (req, res, next) => {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return next(new AppError('No interview found for current ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        interview,
      },
    });
  }),

  //TODO: GET INTERVIEWS THAT MATCHES SEARCH PARAMETERS
  //E.G COMPANYNAME, LOCATION, OFFERSTATUS
  //E.G FIND INTERVIEWS IN ABUJA WITH NO OFFER

  addInterview: catchAsync(async (req, res, next) => {
    const newInterview = await Interview.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        newInterview,
      },
    });
  }),
};
