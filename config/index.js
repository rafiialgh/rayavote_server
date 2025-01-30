require('dotenv').config();
const path = require('path')

module.exports = {
  rootPath: path.resolve(__dirname, '..'),
  urlDB: process.env.MONGO_URI,
  jwtKey: process.env.SECRET,
  emailGmail: process.env.EMAIL,
  appPassword: process.env.APP_PASSWORD
}