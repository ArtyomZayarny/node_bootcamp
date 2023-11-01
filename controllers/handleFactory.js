const mongoose = require('mongoose');
const APIFeatures = require('../utils/ApiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      return next(
        new AppError(`Not document finded with that id = ${id}`, 404),
      );
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`Not document found with that id = ${id}`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { data: doc },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // populate affect perfomace - create new query
    let query = Model.findById(id);
    if (popOptions) {
      query = Model.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
        },
        {
          $lookup: {
            from: popOptions.path,
            foreignField: 'tour',
            localField: '_id',
            as: 'reviews_list',
          },
        },
      ]);
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError(`Not doc found with that id = ${id}`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //To allow for nested GET review on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    //Execute query
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //Explain query details to see performance issues
    // const doc = await features.query.explain();
    const doc = await features.query;
    //Send response
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
