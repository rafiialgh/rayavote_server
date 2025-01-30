var express = require('express')
const router = express.Router()
const { test } = require('./controller')

router.get('/test', test)

module.exports = router