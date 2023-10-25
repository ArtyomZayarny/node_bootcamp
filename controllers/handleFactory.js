const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      return next(new AppError(`Not tour found with that id = ${id}`, 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
