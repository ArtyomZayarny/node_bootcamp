const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res) => {
  //Execute query
  const reviews = await Review.find();

  //Send response
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    reviews,
  });
});

exports.createReview = catchAsync(async (req, res) => {
  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { review },
  });
});
