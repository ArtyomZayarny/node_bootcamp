const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/tours-simple.json`)
);
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    tours,
  });
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
