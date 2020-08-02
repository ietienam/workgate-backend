/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  companyName: {
    type: String,
    trim: true,
    lowercase: true,
    //unique: true
    required: [true, 'A review must show the company name'],
    maxLength: [40, 'A company name must have at most 40 characters'],
    minLength: [5, 'A company name must have at least 5 characters']
  },
  position: {
    type: String,
    lowercase: true,
    required: [true, 'A review must show your position'],
    maxlength: [40, 'A position must have at most 40 characters'],
    minLength: [5, 'A position must have at least 5 characters']
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
  startingSalary: {
    type: Number,
    required: [true, 'A review must show your starting salary'],
    min: [1000, 'A salary must be at least 1000'],
    max: [5000000, 'A  salary must be at most 5,000,000 a month']
  },
  currentSalary: {
    type: Number,
    required: [true, 'A review must show your current salary'],
    min: [1000, 'A salary must be at least 1000'],
    max: [5000000, 'A  salary must be at most 5,000,000 a month']
  },
  recommendsJob: {
    type: Boolean,
    required: [true, 'A review must show if you recommend your current job'],
  },
  promoted: {
    type: Boolean,
    required: [true, 'A review must show if you have been promoted'],
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'A review must show your years of experience'],
    min: [0, 'Years of experience must be at least 0'],
    max: [65, 'Years of experience at most is 65']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    //TO HIDE THIS FIELD FROM THE API OUTPUT, select: false
  },
  jobType: {
    type: String,
    required: [true, 'A review must show if you are employed fulltime or not'],
    enum: {
      values: ['Full-Time', 'Part-Time', 'Internship', 'Contract'],
      message: 'Job types must either be Full-Time, Part-Time, Internships or Contract'
    }
  },
  remote: {
    type: String,
    trim: true,
    required: [
      true,
      'A review must show if you work from home at least 3 times a week',
    ],
    enum: {
      values: ['Fully', 'Partial', 'No'],
      message: 'Work must either be fully, partial or not remote'
    }
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  }
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

reviewSchema.virtual('annualSalary').get(function(){//ARROW FUNCTIONS DONT HAVE ACCESS TO "THIS"
  return this.currentSalary * 12;
});

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: '-__v -passwordChangedAt'
  });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
