/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'An interview should show a company name']
  },
  location: {
    type: String,
    required: [true, 'An interview must have a location']
  },
  offerStatus: {
    type: String,
    required: [true, 'An interview should show an offer status']
  },
  interviewQuestions: {
    type: Array,
    required: [true, 'An interview should show a list of interview questions']
  },
  describeProcess: {
    type: String,
    required: [
      true,
      'An interview should have a description of the application process up untill interview and offer status'
    ]
  },
  comments: {
    type: String,
    default: 'No additional comments'
  }
});

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
