/* eslint-disable prettier/prettier */
const AppError = require('../utils/appError');

//HANDLE ERRORS FOR INVALID ID
const handleObjectIDErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

//HANDLE ERRORS FROM INVALID FIELDS
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 404);
};

const handleWebTokenError = () => new AppError('Invalid Token! Please login again', 401);

const handleExpiredTokenError = () => new AppError('Token Expired! Please login again', 401);

const handleDuplicateEmail = err => {
  const message = `The user: ${err.keyValue.email} already exists!`;
  return new AppError(message, 409);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  //OPERATIONAL ERR. SEND MESSAGE TO CLIENT
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    //LOG TO CONSOLE
    console.error('ERROR: ', err);

    //PROGRAMMING ERROR! SEND THIS TO CLIENT. HIDE ERROR DETAILS
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

//GLOBAL ERROR HANDLER
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log(err)
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message };
    console.log(error)

    //HANDLE ERROR FOR INVALID ID
    if (error.kind === 'ObjectId') error = handleObjectIDErrorDB(error);
    //INVALID ENTRY ERROR(HANDLES VALIDATION ERROR FOR FIELDS)
    if (error.errors) error = handleValidationErrorDB(error);
    //HANDLE DUPLICATE EMAIL
    if (error.name === 'MongoError') error = handleDuplicateEmail(error);
    if (error.name === 'JsonWebTokenError') error = handleWebTokenError();
    if (error.name === 'TokenExpiredError') error = handleExpiredTokenError();

    sendErrorProd(error, res);
  }

};
