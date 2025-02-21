const express = require('express')
const router = express.Router()
const { createElection, getElectionsByCompany, getOrCreateElection, editElection, getElectionStatus } = require('./controller');
const { isLoginCompany } = require('../middleware/auth');
const checkElectionMiddleware = require('../middleware/election');

router.post('/create', isLoginCompany, checkElectionMiddleware, createElection)
router.get('/getElection/:address', getElectionsByCompany)
router.get('/check', getOrCreateElection)
router.put('/:id', isLoginCompany, editElection)
router.get('/status/:address', getElectionStatus)

module.exports = router;

