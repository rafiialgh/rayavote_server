const express = require('express')
const router = express.Router()
const { addCandidate, getCandidateByCompany, deleteCandidate, editCandidate, addImageCandidate } = require('./controller')
const { isLoginCompany } = require('../middleware/auth')
const multer = require('multer');
const os = require('os');

router.post('/register', isLoginCompany, addCandidate)
router.get('/getCandidate', isLoginCompany, getCandidateByCompany)
router.delete('/:id', isLoginCompany, deleteCandidate)
router.put('/:id', isLoginCompany, editCandidate)
router.post('/addImage', multer({ dest: os.tmpdir() }).single('avatar'), addImageCandidate)

module.exports = router