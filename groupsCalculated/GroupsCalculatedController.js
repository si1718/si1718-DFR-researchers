var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var groupsCalculatedModel = require('./GroupsCalculated');

/* configura dentro de express el middleware bodyparser json */
router.use(bodyParser.json());

/* Método GET que devuelve los grupos con más de 40 investigadores */
router.get('/groupsCalculated', function (request, response) {
    var query = {};
    
    console.log("INFO: New GET request to /groupsCalculated");
    groupsCalculatedModel.find(query, function (err, groupsCalculated) {
        
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending groupsCalculated: " + JSON.stringify(groupsCalculated, 2, null));
            response.send(groupsCalculated);
        }
    });
});

module.exports = router;