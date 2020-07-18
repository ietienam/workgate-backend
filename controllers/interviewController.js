const fs = require("fs");

const interviews = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/interviews.json`)
);

module.exports = {
  checkID: (req, res, next, val) => {
    console.log(`Interview ID is ${val}`);
    const id = parseInt(req.params.id);
    const interview = interviews.find((el) => el.id === id);
    if (!interview) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid ID",
      });
    }
    next();
  },

  getAllInterviews:  (req, res) => {
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: interviews.length,
      data: {
        interviews,
      },
    });
  },

  getInterview: (req, res) => {
    const id = parseInt(req.params.id);
    const interview = interviews.find((el) => el.id === id);
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        interview,
      },
    });
  },

  //TODO: ADD ROUTE TO VIEW INTERVIEWS THAT MATCH COMPANYNAME SEARCH

  addInterview: (req, res) => {
    const newId = interviews[interviews.length - 1].id + 1;
    const newInterview = Object.assign({ id: newId }, req.body);
    interviews.push(newInterview);
    fs.writeFile(
      `${__dirname}/../dev-data/data/interviews.json`,
      JSON.stringify(interviews),
      () => {
        res.status(201).json({
          status: "success",
          requestedAt: req.requestTime,
          data: {
            interview: newInterview,
          },
        });
      }
    );
  }
}
