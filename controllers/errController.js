/* eslint-disable prettier/prettier */
const AppError = require('../utils/appError');

//HANDLE ERRORS FOR INVALID ID
const handleObjectIDErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 404);
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

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    //HANDLE ERROR FOR INVALID ID
    if (error.kind === 'ObjectId') error = handleObjectIDErrorDB(error);
    //INVALID ENTRY ERROR(HANDLES VALIDATION ERROR FOR FIELDS)
    if (error.errors) {
      error = handleValidationErrorDB(error);
    }
    sendErrorProd(error, res);
  }

};
