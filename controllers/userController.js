/* eslint-disable prettier/prettier */
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

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
      data: {
        user,
      },
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
      message: 'user deleted'
    });
  }),
};
