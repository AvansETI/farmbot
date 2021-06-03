const express     = require('express');
const router      = express.Router();

const auth        = require('../logic/auth.js')
const points      = require('../logic/farmbotCom/setup')
const sequence    = require('../logic/farmbotCom/sequences')

router.post('/login',  auth.getToken);
router.get('/points',  auth.validateToken, points.generatePoints);
//router.post('/points', auth.validateToken,  sequence.sequencePhoto);
router.post('/sequence', auth.validateToken, sequence.sequencePhoto);

module.exports = router;