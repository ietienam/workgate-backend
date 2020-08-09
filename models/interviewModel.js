/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  companyName: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, 'An interview should show a company name']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'An interview must show a rating']
  },
  location: {
    // GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String
  },
  offerStatus: {
    type: String,
    trim: true,
    enum: {
      values: ['Accepted', 'Rejected', 'No-Offer'],
      message: 'Offer status must either bet Accepted, Rejected or No-Offer'
    },
    required: [true, 'An interview should show an offer status']
  },
  interviewQuestions: {
    type: [String],
    required: [true, 'An interview should show a list of interview questions']
  },
  describeProcess: {
    type: String,
    trim: true,
    required: [
      true,
      'An interview should have a description of the application process up untill interview and offer status'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  comments: {
    type: String,
    trim: true,
    default: 'No additional comments'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Interview must belong to a user']
  }
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
