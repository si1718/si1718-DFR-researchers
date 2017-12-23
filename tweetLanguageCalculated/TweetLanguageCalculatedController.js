var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var tweetLanguageCalculatedModel = require('./TweetLanguageCalculated');

/* configura dentro de express el middleware bodyparser json */
router.use(bodyParser.json());

/* Método GET que devuelve todos los investigadores */
router.get('/tweetsLanguageCalculated', function (request, response) {
    var query = {};
    
    console.log("INFO: New GET request to /tweetsLanguageCalculated");
    tweetLanguageCalculatedModel.find(query, function (err, tweetsLanguageCalculated) {
        
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending tweetsLanguageCalculated: " + JSON.stringify(tweetsLanguageCalculated, 2, null));
            response.send(tweetsLanguageCalculated);
        }
    });
});

module.exports = router;