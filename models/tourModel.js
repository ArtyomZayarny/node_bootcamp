const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'Tour name must have less or equal 40 characters'],
      minlength: [10, 'Tour name must have more or equal 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maxGroupSize'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // It works only for create
          return val < this.price; // 100 < 200
        },
        message: 'Discount price ({VALUE}) should be below the regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have iamge cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual properties !Not use in queris because it not exist in DB
// callback must be not arrow functions
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// MongoDb middleware
// There are four types of middleware in Mongoose
// Document | Query | Aggregate | Model;

// Document on pre - runs  before event - .save()   .create() | !not insertMany()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Multiple pre or post middleware
tourSchema.pre('save', function (next) {
  console.log('Will save document....');
  next();
});

// Post middleware
tourSchema.post('save', function (doc, next) {
  console.log('doc', doc);
  next();
});

// Query midleware
// Exclude secretTour from result of find query Problem it's not work for finOne
tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// Exclude secretTour from result of every query that starts from 'find'
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  //console.log(docs);
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// Aggregation middleware
// Exclude secretTour from aggregation

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
