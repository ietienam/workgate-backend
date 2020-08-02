/* eslint-disable prettier/prettier */
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

module.exports = {
  getAllUsers: catchAsync(async (req, res, next) => {
    const features = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const user = await features.query;
    res.status(500).json({
      status: 'success',
      results: user.length,
      data: {
        user,
      },
    });
  }),

  updateMe: catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.confirmPassword) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'email');

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    ).select([
      '-passwordResetToken',
      '-passwordChangedAt',
      '-passwordResetExpires',
      '-__v',
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  }),

  deleteMe: catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }),

  getUser: (req, res) => {
    res.status(500).json({
      status: 'err',
      message: 'This route is not yet defined',
    });
  },

  editUser: (req, res) => {
    res.status(500).json({
      status: 'err',
      message: 'This route is not yet defined',
    });
  },

  deleteUser: catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new AppError('No user found for this ID', 404));
    res.status(204).json({
      status: 'success',
      message: 'user deleted',
    });
  }),
};
