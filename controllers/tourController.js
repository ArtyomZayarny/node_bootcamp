const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/tours-simple.json`),
);

const checkID = (req, res, next, val) => {
  const { id } = req.params;

  const tour = tours.find((el) => el.id === +id);
  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: `No tour with id: ${id}`,
    });
  }

  next();
};

const checkBody = (req, res, next) => {
  const { body } = req;

  if (!body.name || !body.price) {
    return res.status(400).json({
      status: 'error',
      message: 'Bad Request, missing name or price',
    });
  }
  next();
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    tours,
  });
};

const getTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((el) => el.id === +id);
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'success',
        data: newTour,
      });
    },
  );
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
  checkID,
  checkBody,
};

module.exports = tourController;
