/* eslint-disable prettier/prettier */
const Interview = require('../models/interviewModel');

module.exports = {
  getAllInterviews: async (req, res) => {
    try {
      //1A) FILTERING
      const queryObj = { ...req.query };
      const excludedFields = ['page', 'limit', 'fields'];
      excludedFields.forEach(el => delete queryObj[el]);

      //1B ADVANCED FILTERING
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

      let query = Interview.find(JSON.parse(queryStr));

      //2) SORTING
      if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
      } else {
        query = query.sort('-createdAt');
      }

      const interviews = await query;
      
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
