var express = require('express');
const { resultMail } = require('./controller');
const router = express.Router();

router.post('/', resultMail)

module.exports = router