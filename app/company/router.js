var express = require('express');
const router = express.Router();
const { signup, signin } = require('./controller');
const { isLoginCompany } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/signin', signin)

module.exports = router;
