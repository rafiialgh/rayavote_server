const express = require('express')
const router = express.Router()
const { createElection, getElectionsByCompany, getOrCreateElection, editElection } = require('./controller');
const { isLoginCompany } = require('../middleware/auth');
const checkElectionMiddleware = require('../middleware/election');

router.post('/create', isLoginCompany, checkElectionMiddleware, createElection)
router.get('/getElection', isLoginCompany, getElectionsByCompany)
router.get('/check', getOrCreateElection)
router.put('/:id', isLoginCompany, editElection)

module.exports = router;

