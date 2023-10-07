const express = require('express');
const app = express();
const morgan = require('morgan');
const port = 3000;
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

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

// Mountaining routing
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

 
// 4 Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
