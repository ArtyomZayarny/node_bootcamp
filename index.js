const express = require('express');
const fs = require('fs');
const app = express();
const morgan = require('morgan');
const port = 3000;

// 1) Middleware
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware 🙂 ');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/tours-simple.json`)
);

// 2 Route Handlers for Tour

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    tours,
  });
};

const getTourById = (req, res) => {
  const { id } = req.params;

  const tour = tours.find((tour) => tour.id == id);

  if (!tour) {
    res.status(404).json({
      status: 'failed',
      message: `No tour with id: ${id}`,
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: newTour,
      });
    }
  );
};

const updateTour = (req, res) => {
  const { id } = req.params;

  const tour = tours.find((tour) => tour.id == id);

  if (!tour) {
    res.status(404).json({
      status: 'failed',
      message: `No tour with id: ${id}`,
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;

  const tour = tours.find((tour) => tour.id == id);

  if (!tour) {
    res.status(404).json({
      status: 'failed',
      message: `No tour with id: ${id}`,
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// Users handlers

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route not yet defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route not yet defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route not yet defined',
  });
};

// 3 Routes
const tourRouter = express.Router();

const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);

app.route('/').get(getAllUsers).post(createUser);

app.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// 4 Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
