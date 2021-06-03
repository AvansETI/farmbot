const express     = require('express');
const router      = express.Router();

const config      = require('../config.json');
const setup       = require('../logic/farmbotCom/setup');

var Module = module.exports;
Module.getToken  = getToken;
Module.validateToken = validateToken;
Module.getToken = getToken;


function getToken(req, res) {
    const email     = req.body.email;
    const password = req.body.password;
    axios
      .post(config.api.API_URL + "/tokens", {
        'user': {'email': email, 'password': password}
      })
      .then(function (resp) {
        setup.createToken();
        let farmbot_id = resp.data.token.unencoded.bot;
        res.status(200).json({token: resp.data.token.encoded});
        console.log(`Got API Token from ${farmbot_id}...`);
        })
      .catch(function (err) {
        res.status(401).json({status: `E-mail or password not valid!`});
        console.log(`E-mail or password not valid!`);
     });
}

function validateToken(req, res, next) {
    const token = req.query.token;
    
    if ( token == 123456 ) {
        next();
    } else {
        res.status(401).json({status: "Not authorized!"});
    }
}