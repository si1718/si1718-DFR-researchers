var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var departmentsCalculatedModel = require('./DepartmentsCalculated');

/* configura dentro de express el middleware bodyparser json */
router.use(bodyParser.json());

/* Método GET que devuelve todos los departamentos con más de 100 investigadores */
router.get('/departmentsCalculated', function (request, response) {
    var query = {};
    
    console.log("INFO: New GET request to /departmentsCalculated");
    departmentsCalculatedModel.find(query, function (err, departmentsCalculated) {
        
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending departmentsCalculated: " + JSON.stringify(departmentsCalculated, 2, null));
            response.send(departmentsCalculated);
        }
    });
});

module.exports = router;