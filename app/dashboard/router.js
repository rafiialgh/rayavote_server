const express = require('express')
const { getDashboard } = require('./controller')
const { isLoginCompany } = require('../middleware/auth')
const router = express.Router()

router.get('/', isLoginCompany, getDashboard)

module.exports = router