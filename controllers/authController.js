/* eslint-disable prettier/prettier */
const crypto = require('crypto');
const { promisify } = require('util'); //CONVERT FUNCTION TO ASYNC TO AWAIT A PROMISE
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

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
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError(
            'You do not have permission to perform this action!',
            403
          )
        );
      }
      next();
    };
  },

  forgotPassword: catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('There is no user with email address.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 5 min)',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError('There was an error sending the email. Try again later!'),
        500
      );
    }
  }),

  resetPassword: catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  }),

  updatePassword: catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    // User.findByIdAndUpdate will NOT work as intended!
    const user = await User.findById(req.user.id).select('+password');

    const { currentPassword, password, confirmPassword } = req.body;

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(currentPassword, user.password))) {
      return next(new AppError('Incorrect password!', 401));
    }

    // 3) If so, update password
    user.password = password;
    user.confirmPassword = confirmPassword;
    await user.save();

    // 4) Log the user in, send JWT
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  }),
};