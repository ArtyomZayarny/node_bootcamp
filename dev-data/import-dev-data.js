const fs = require('fs');

const mongoose = require('mongoose');

const dotenv = require('dotenv');
const Tour = require('../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.MONGO_DB_CONNECT.replace(
  '<password>',
  process.env.MONGO_DB_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => console.log('Error:', err));

// Read JSON File
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

//Import Data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('✅ Data is loaded succesfull');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//Delete all data from Collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('✅ Data is deleted succesfull');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
