var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var recommendationsModel = require('./Recommendations');

/* configura dentro de express el middleware bodyparser json */
router.use(bodyParser.json());

/* Método GET que devuelve todas las recomendaciones */
router.get('/recommendations', function (request, response) {
    var query = {};
    
    console.log("INFO: New GET request to /recommendations");
    recommendationsModel.find(query, function (err, recommendations) {
        
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending recommendations: " + JSON.stringify(recommendations, 2, null));
            response.send(recommendations);
        }
    });
});

/* Método GET que devuelve todos las recomendaciones filtrado por idResearcher */
router.get('/recommendations/:idResearcher', function (request, response) {
    var idResearcher = request.params.idResearcher;
    if (!idResearcher) {
        console.log("WARNING: New GET request to /recommendations/:idResearcher without idResearcher, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /recommendations/" + idResearcher);
        recommendationsModel.findOne({idResearcher:idResearcher}, function (err, recommendations) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
               
                if (recommendations) {
                    //since we expect to have exactly ONE researcher with this idResearcher
                    console.log("INFO: Sending researcher: " + JSON.stringify(recommendations, 2, null));
                    response.send(recommendations);
                } else {
                    console.log("WARNING: There are not any research with idResearcher " + idResearcher);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

module.exports = router;