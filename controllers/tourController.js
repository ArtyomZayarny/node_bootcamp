const Tour = require('../models/tourModel');

const getAllTours = async (req, res) => {
  console.log('query', req.query);
  try {
    //Build query
    // 1A Filtering
    const queryObj = { ...req.query };
    const exludedFields = ['page', 'sort', 'limit', 'fields'];

    //Filter fields in request
    exludedFields.forEach((el) => delete queryObj[el]);

    // 1B Advanced filteringq
    const queryStr = JSON.stringify(queryObj);
    const replacedQuery = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    // duration => 5
    // { difficulty: 'easy', duration: { $gte: 5 }}

    //price <= 1500
    // { difficulty: 'easy', price: { $lt: 1500 }}

    let query = Tour.find(JSON.parse(replacedQuery));

    // 2 Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      //sort('price ratingAverage')
    } else {
      query = query.sort('-createdAt');
    }

    //Execute query

    const tours = await query;

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

const tourController = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};

module.exports = tourController;
