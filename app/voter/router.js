var express = require('express');
const router = express.Router();
const { signup, signin, deleteVoter, editVoter, getVoterByCompany } = require('./controller');
const multer = require('../middleware/multer');
const { isLoginCompany } = require('../middleware/auth');

router.post('/register', isLoginCompany, signup);
router.post('/signin', signin)
router.get('/getVoter', isLoginCompany, getVoterByCompany)
router.delete('/:id', isLoginCompany, deleteVoter)
router.put('/:id', isLoginCompany, editVoter)

module.exports = router;
