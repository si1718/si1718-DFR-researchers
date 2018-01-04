var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var wordsCloudModel = require('./WordsCloud');

/* configura dentro de express el middleware bodyparser json */
router.use(bodyParser.json());

/* Método GET que devuelve todos los departamentos con más de 100 investigadores */
router.get('/wordsCloud', function (request, response) {
    var query = {};
    
    console.log("INFO: New GET request to /wordsCloud");
    wordsCloudModel.find(query, function (err, wordsCloud) {
        
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending wordsCloud: " + JSON.stringify(wordsCloud, 2, null));
            response.send(wordsCloud);
        }
    });
});

module.exports = router;