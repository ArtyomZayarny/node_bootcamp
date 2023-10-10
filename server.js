const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
