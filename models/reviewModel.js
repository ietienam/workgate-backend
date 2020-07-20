/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'A review must show the company name'],
  },
  position: {
    type: String,
    default: 'Annonymous',
  },
  location: {
    type: String,
    required: [true, 'A review must show the company location'],
  },
  startingSalary: {
    type: Number,
    required: [true, 'A review must show your starting salary'],
  },
  currentSalary: {
    type: Number,
    required: [true, 'A review must show your current salary'],
  },
  typeOfEmployment: {
    type: String,
    required: [true, 'A review must show your type of employment'],
  },
  recommendsJob: {
    type: Boolean,
    required: [true, 'A review must show if you recommend your current job'],
  },
  currentStaff: {
    type: Boolean,
    required: [true, 'A review must show if you are a current staff'],
  },
  companySize: {
    type: String,
    default: 'Can not estimate',
  },
  promoted: {
    type: Boolean,
    required: [true, 'A review must show if you have been promoted'],
  },
  employmentDuration: {
    type: String,
    default: 'Rather not say',
  },
  universityGraduate: {
    type: Boolean,
    required: [true, 'A review must show if you are a graduate or not'],
  },
  modeOfEmployment: {
    type: String,
    required: [true, 'A review must show how you got the job'],
  },
  remote: {
    type: String,
    required: [
      true,
      'A review must show if you work from home at least 3 times a week',
    ],
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
