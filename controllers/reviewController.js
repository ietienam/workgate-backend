const fs = require("fs");

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/reviews.json`)
);

module.exports = {
  checkID: (req, res, next, val) => {
    console.log(`Interview ID is ${val}`);
    const id = parseInt(req.params.id);
    const review = reviews.find((el) => el.id === id);
    if (!review) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid ID",
      });
    }
    next();
  },

  //TODO: CREATE A MIDDLEWARE TO CHECK IF REVIEW POST CONTAIN
  //IMPORTANT FIELDS LIKE COMPANYNAME OR SALARY
  //IMPLEMENT IT ON INTERVIEW AND USER ROUTES

  getAllReviews: (req, res) => {
    res.status(200).json({
      status: "success",
      results: reviews.length,
      requestedAt: req.requestTime,
      data: {
        reviews,
      },
    });
  },

  getReview: (req, res) => {
    //TODO: CHANGE TO GET REVIEWS THAT MATCH COMPANYNAME SEARCH
    const id = parseInt(req.params.id);
    const review = reviews.find((el) => el.id === id);
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        review,
      },
    });
  },

  addReview: (req, res) => {
    //set new id to the id of the previous review plus one
    const newId = reviews[reviews.length - 1].id + 1;
    //merge the object with id to the new review object so it has an id
    const newReview = Object.assign({ id: newId }, req.body);
    reviews.push(newReview);
    fs.writeFile(
      `${__dirname}/../dev-data/data/reviews.json`,
      JSON.stringify(reviews),
      () => {
        res.status(201).json({
          status: "success",
          requestedAt: req.requestTime,
          data: {
            review: newReview,
          },
        });
      }
    );
  }
}
