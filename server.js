const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('unhandledRejection', (err) => {
  console.log('unhandledRejection', err.name, err.message);
  console.log('unhandledRejection 🎆');

  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.log('uncaughtException', err.name, err.message);
  console.log('uncaughtException 🎆');

  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.MONGO_DB_CONNECT.replace(
  '<password>',
  process.env.MONGO_DB_PASSWORD,
);

/* How to hanle Unhandled promise rejection 
for example wrong connection to DB
*/

mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
});
//  .catch((err) => console.log('Error:'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
