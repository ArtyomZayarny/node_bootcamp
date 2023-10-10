const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/ApiFeatures');

const getAllTours = async (req, res) => {
  try {
    //Execute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    //Send response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      tours,
    });
  } catch (err) {
    res.status(404).json({
      status: 'faild',
      message: err,
    });
  }
};

const getTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    res.status(404).json({
      status: 'faild',
      message: error,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error,
    });
  }
};

const updateTour = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error,
    });
  }
};

const deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    await Tour.findByIdAndDelete(id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error,
    });
  }
};

const aliasTopTours = async (req, res, next) => {
  //?limit=5&sort=-ratingsAverage,price
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const tourController = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
};

module.exports = tourController;
