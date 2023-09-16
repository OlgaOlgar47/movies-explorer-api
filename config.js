require('dotenv').config();

const PORT = 3001;
const DATABASE_DEV = 'mongodb://127.0.0.1:27017/bitfilmsdb';
const JWT_SECRET = process.env;
const NODE_ENV = process.env;
const DATABASE_URL = process.env;

module.exports = {
  PORT,
  NODE_ENV,
  JWT_SECRET,
  DATABASE_URL,
  DATABASE_DEV
};
