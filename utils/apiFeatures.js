/* eslint-disable prettier/prettier */
class APIFeatures {
  //query contains the review or interview find response before filtering, sorting, limiting or pagination is performed
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((el) => {
      delete queryObj[el];
    });
    
    //ADVANCED FILTERIMG
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    // PERFORM GET REQUEST
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() { //REMOVES FIELDS FROM THE RESPONSE
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1; //set current page or 1 by default. back button manipulates current page
    const limit = 30; // limit by default set to 30 results per page
    const skip = (page - 1) * limit;

    //page=3&limit=30 go to page 3 with 30 results per page. skip to start from 61st result
    //page 1 = 1-30, page 2 = 31-60, page 3 = 61-90
    this.query = this.query.skip(skip).limit(limit);

    //COUNT DOCUMENTS BUT NO LONGER NECESSARY
    /*if (this.queryString.page) {
      const numOfReviews = this.query.countDocuments();
      if (skip >= numOfReviews) throw new Error('This page does not exist!');
    }*/

    return this;
  }
}
module.exports = APIFeatures;
