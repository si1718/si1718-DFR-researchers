var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file

function verifyToken(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];
  if (!token) 
    return res.status(403).send({ auth: false, message: 'No token provided.' });

  // verifies secret and checks exp
  jwt.verify(token, config.secret, function(err, decoded) {      
    if (err) 
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });    

    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });

}

function checkAccessToken(req, res, next){
    var request = require("request");
    var token = req.query.token;
    
    var options = { method: 'GET',
      url: 'https://si1718-dfr-researchers.eu.auth0.com/userinfo',
      headers: 
       { authorization: 'Bearer ' + token,
         'content-type': 'application/json' } };
    
    request(options, function (error, response, body) {
      
      if (body == "Unauthorized"){
         return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' }); 
      }else{
        next();
      }
   
      console.log(body);
    });
}

module.exports = checkAccessToken;