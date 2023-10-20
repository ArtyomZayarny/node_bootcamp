const reviewsRouter = require('express').Router();
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

reviewsRouter
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user '),
    reviewController.createReview,
  );

module.exports = reviewsRouter;
