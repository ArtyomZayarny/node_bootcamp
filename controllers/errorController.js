const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProduction = (err, res) => {
  // OPerational error, trusted errors: send message to client
  if (err.isOperation) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programing or other unknown error: don't leak error details
  } else {
    // 1 log Error
    console.error('ERROR  🐸 ', err);

    // 2 send generic error
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProduction(err, res);
  }
};
