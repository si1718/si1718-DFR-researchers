var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var researcherModel = require('./Researcher');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

/* configura dentro de express el middleware bodyparser json */
router.use(bodyParser.json());

/* Create middleware for checking the JWT */
var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://si1718-dfr-researchers.eu.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://si1718-dfr-researchers.com',
    issuer: "https://si1718-dfr-researchers.eu.auth0.com/",
    algorithms: ['RS256']
});

/* Método GET que devuelve todos los investigadores */
router.get('/researchers', jwtCheck, function (request, response) {
    
    var param = request.query.search;
    var query = {};
    if (param){
        query = { $or:[ 
            {'name':{ $regex: '.*' + param + '.*', $options: 'i' }}, 
            {'phone':{ $regex: '.*' + param + '.*', $options: 'i' }}, 
            {'orcid':{ $regex: '.*' + param + '.*', $options: 'i' }},
            {'researcherId':{ $regex: '.*' + param + '.*', $options: 'i' }}, 
            {'link':{ $regex: '.*' + param + '.*', $options: 'i' }}, 
            {'idGroup':{ $regex: '.*' + param + '.*', $options: 'i' }}, 
            {'idDepartment':{ $regex: '.*' + param + '.*', $options: 'i' }}, 
            {'professionalSituation':{ $regex: '.*' + param + '.*', $options: 'i' }} 
        ]};
    }
    
    console.log("INFO: New GET request to /researchers");
    researcherModel.find(query, function (err, researchers) {
        
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending researchers: " + JSON.stringify(researchers, 2, null));
            response.send(researchers);
        }
    });
});

module.exports = router;