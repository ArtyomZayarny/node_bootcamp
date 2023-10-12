const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
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
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
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
//callback must be not arrow functions
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// MongoDb middleware
// There are four types of middleware in Mongoose
// Document | Query | Aggregate | Model

// Document on pre - runs  before event - .save()   .create() | !not insertMany()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Multiple pre or post middleware
// tourSchema.pre('save', function (next) {
//   console.log('Will save document....');
//   next();
// });

// //Post middleware
// tourSchema.post('save', function (doc, nex) {
//   console.log('doc', doc);
//   next();
// });

//Query midleware
//Exclude secretTour from result of find query Problem it's not work for finOne
tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

//Exclude secretTour from result of every query that starts from 'find'
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(docs);
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
