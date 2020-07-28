/* eslint-disable prettier/prettier */
const { promisify } = require('util'); //CONVERT FUNCTION TO ASYNC TO AWAIT A PROMISE
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = {
  signUp: catchAsync(async (req, res, next) => {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  }),

  logIn: catchAsync(async (req, res, next) => {
    //1) CHECK IF EMAIL AND PASSWORD EXISTS
    const { email, password } = req.body;
    if (!email || !password)
      return next(new AppError('Please provide valid email and password', 404));

    //2) CHECK IF USERS EXIST AND PASSWORD IS CORRECT
    const user = await User.findOne({ email: email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    //3) IF EVERYTHING IS OK, SEND TOKEN TO CLIENT
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  }),

  protect: catchAsync(async (req, res, next) => {
    //GETTING TOKEN AND CHECK IF ITS THERE
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return next(new AppError('Access denied! Please logIn', 401));

    //VERIFY TOKEN
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded.id);

    //CHECK IF USER STILL EXISTS
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next(
        new AppError('The user for this token no longer exists!', 401)
      );
    }

    //CHECK IF USER CHANGED PASSWORD AFTER TOKEN WAS ISSUED
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401
        )
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  }),

  restrictTo: (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role))
        return next(
          new AppError(
            'You do not have permission to perform this action!',
            403
          )
        );

      next();
    };
  },
};
