var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var wordsCloudModelV2 = require('./WordsCloudV2');

/* configura dentro de express el middleware bodyparser json */
router.use(bodyParser.json());

/* Método GET que devuelve todos los departamentos con más de 100 investigadores */
router.get('/wordsCloudV2', function (request, response) {
    var query = {};
    
    console.log("INFO: New GET request to /wordsCloudV2");
    wordsCloudModelV2.find(query, function (err, wordsCloudV2) {
        
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending wordsCloud: " + JSON.stringify(wordsCloudV2, 2, null));
            response.send(wordsCloudV2);
        }
    });
});

module.exports = router;