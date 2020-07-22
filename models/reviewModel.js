/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  companyName: {
    type: String,
    trim: true,
    required: [true, 'A review must show the company name'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'A review must have a rating']
  },
  position: {
    type: String,
    trim: true,
    default: 'Annonymous',
  },
  location: {
    type: String,
    trim: true,
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
    trim: true,
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
    trim: true,
    default: 'Can not estimate',
  },
  promoted: {
    type: Boolean,
    required: [true, 'A review must show if you have been promoted'],
  },
  employmentDuration: {
    type: String,
    trim: true,
    default: 'Rather not say',
  },
  universityGraduate: {
    type: Boolean,
    required: [true, 'A review must show if you are a graduate or not'],
  },
  modeOfEmployment: {
    type: String,
    trim: true,
    required: [true, 'A review must show how you got the job'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    //TO HIDE THIS FIELD FROM THE API OUTPUT, select: false
  },
  remote: {
    type: String,
    trim: true,
    required: [
      true,
      'A review must show if you work from home at least 3 times a week',
    ],
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
