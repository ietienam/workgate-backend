const express = require("express");
const morgan = require("morgan");
const reviewRouter = require('./routes/reviewRoutes');
const interviewRouter = require('./routes/interviewRoutes');
const userRouter = require('./routes/userRoutes');

//VARIABLES
const app = express();

//MIDDLEWARES
app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toLocaleString();
  console.log(req.requestTime);
  next();
});


//ROUTES

app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/interviews', interviewRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
