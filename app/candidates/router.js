const express = require('express')
const router = express.Router()
const { addCandidate, getCandidateByCompany, deleteCandidate, editCandidate, addImageCandidate } = require('./controller')
const { isLoginCompany } = require('../middleware/auth')
const multer = require('../middleware/multer');

router.post('/register', isLoginCompany, addCandidate)
router.get('/getCandidate', isLoginCompany, getCandidateByCompany)
router.delete('/:id', isLoginCompany, deleteCandidate)
router.put('/:id', isLoginCompany, editCandidate)
router.post('/addImage', multer, addImageCandidate)

module.exports = router