const express = require('express');
const router = express.Router();

router.post('/login',  auth.getToken);

router.post('/image', (req, res) => {
    //save image to files system and database
})

module.exports = router;