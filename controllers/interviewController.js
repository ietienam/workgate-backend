/* eslint-disable prettier/prettier */
const Interview = require('../models/interviewModel');
const APIFeatures = require('../utils/apiFeatures');

module.exports = {
  getAllInterviews: async (req, res) => {
    try {
      const features = new APIFeatures(Interview.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const interviews = await features.query;

      res.status(200).json({
        status: "success",
        results: interviews.length,
        data: {
          interviews
        },
      });
    } catch (error) {
      res.status(404).json({
        status: 'fail',
        message: error
      });
    }
  },

  getInterview: async (req, res) => {
    try {
      const interview = await Interview.findById(req.params.id);
      res.status(200).json({
        status: "success",
        data: {
          interview
        },
      });
    } catch (error) {
      res.status(404).json({
        status: "fail",
        message: error
      });
    }
  },

    //TODO: GET INTERVIEWS THAT MATCHES SEARCH PARAMETERS
    //E.G COMPANYNAME, LOCATION, OFFERSTATUS
    //E.G FIND INTERVIEWS IN ABUJA WITH NO OFFER

  addInterview: async (req, res) => {
    try {
      const newInterview = await Interview.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          newInterview
        }
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error
      });
    }
  }
}
