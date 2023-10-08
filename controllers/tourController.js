const Tour = require('../models/tourModel');

const getAllTours = (req, res) => {
  // res.status(200).json({
  //   status: 'success',
  //   results: tours.length,
  //   tours,
  // });
};

const getTour = (req, res) => {
  const { id } = req.params;
  // const tour = tours.find((el) => el.id === +id);
  // res.status(200).json({
  //   status: 'success',
  //   data: { tour },
  // });
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

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const tourController = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};

module.exports = tourController;
