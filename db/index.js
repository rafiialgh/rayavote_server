const mongoose = require('mongoose');
const { urlDB } = require('../config')

const connectDB = async () => {
  try {
    await mongoose.connect(urlDB);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;