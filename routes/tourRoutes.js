const tourRouter = require('express').Router();
const tourController = require('../controllers/tourController');

// Params middleware
//tourRouter.param('id', tourController.checkID);

tourRouter
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRouter;
