class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const exludedFields = ['page', 'sort', 'limit', 'fields'];

    //Filter fields in request
    exludedFields.forEach((el) => delete queryObj[el]);

    // 1B Advanced filteringq
    const queryStr = JSON.stringify(queryObj);
    const replacedQuery = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    this.query = this.query.find(JSON.parse(replacedQuery));

    return this;
  }

  sort() {
    // 2 Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      //sort('price ratingAverage')
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // 4 Pagination
    //page=2&limit=10   1-10 - page1, 11-20 - page 2
    const page = this.queryString.page * 1 || 1; // convert string to number;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
