var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var researchersCalculatedModel = require('./ResearchersCalculated');

/* configura dentro de express el middleware bodyparser json */
router.use(bodyParser.json());

/* Método GET que devuelve el número de investigadores con/sin ORCID */
router.get('/researchersCalculated', function (request, response) {
    var query = {};
    
    console.log("INFO: New GET request to /groupsCalculated");
    researchersCalculatedModel.find(query, function (err, researchersCalculated) {
        
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending researchersCalculated: " + JSON.stringify(researchersCalculated, 2, null));
            response.send(researchersCalculated);
        }
    });
});

module.exports = router;