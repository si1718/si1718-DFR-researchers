var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var tweetCalculatedModel = require('./TweetCalculated');

/* configura dentro de express el middleware bodyparser json */
router.use(bodyParser.json());

/* Método GET que devuelve todos los investigadores */
router.get('/tweetsCalculated', function (request, response) {
    var query = {};
    
    console.log("INFO: New GET request to /tweetsCalculated");
    tweetCalculatedModel.find(query, function (err, tweetsCalculated) {
        
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending tweetsCalculated: " + JSON.stringify(tweetsCalculated, 2, null));
            response.send(tweetsCalculated);
        }
    });
});

module.exports = router;