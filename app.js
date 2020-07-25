/* eslint-disable prettier/prettier */
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errController');
const reviewRouter = require('./routes/reviewRoutes');
const interviewRouter = require('./routes/interviewRoutes');
const userRouter = require('./routes/userRoutes');

//VARIABLES
const app = express();

//MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
//TO SERVE STATIC FILES LIKE HTML, IMG, CSS
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toLocaleString();
  console.log(req.requestTime);
  next();
});

//ROUTES
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/interviews', interviewRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
