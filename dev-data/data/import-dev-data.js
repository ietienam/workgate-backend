/* eslint-disable prettier/prettier */
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Review = require('../../models/reviewModel');
const Interview = require('../../models/interviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PW);

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful...');
  })

const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
const interviews = JSON.parse(fs.readFileSync(`${__dirname}/interviews.json`, 'utf-8'));

const importData = async () => {
  try {
    await Review.create(reviews);
    await Interview.create(interviews);
    console.log('Data sucessfully sent!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Review.deleteMany();
    await Interview.deleteMany();
    console.log('Data sucessfully deleted!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
}

//RUN IN TERMINAL TO IMPORT TO DB node dev-data/data/import-dev-data.js --import
//RUN IN TERMINAL TO DELETE FROM DB node dev-data/data/import-dev-data.js --delete

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
