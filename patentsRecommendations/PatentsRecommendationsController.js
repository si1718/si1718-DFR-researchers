var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var patentsRecommendationsModel = require('./PatentsRecommendations');

/* configura dentro de express el middleware bodyparser json */
router.use(bodyParser.json());

/* Método GET que devuelve todas las recomendaciones */
router.get('/patentsRecommendations', function (request, response) {
    var query = {};
    
    console.log("INFO: New GET request to /patentsRecommendations");
    patentsRecommendationsModel.find(query, function (err, patentsRecommendations) {
        
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending patentsRecommendations: " + JSON.stringify(patentsRecommendations, 2, null));
            response.send(patentsRecommendations);
        }
    });
});

/* Método GET que devuelve todos las recomendaciones filtrado por idResearcher */
router.get('/patentsRecommendations/:idResearcher', function (request, response) {
    var idResearcher = request.params.idResearcher;
    if (!idResearcher) {
        console.log("WARNING: New GET request to /patentsRecommendations/:idResearcher without idResearcher, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /patentsRecommendations/" + idResearcher);
        patentsRecommendationsModel.find({researchers:idResearcher}, function (err, patentsRecommendations) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
               
                if (patentsRecommendations) {
                    //since we expect to have exactly ONE researcher with this idResearcher
                    console.log("INFO: Sending researcher: " + JSON.stringify(patentsRecommendations, 2, null));
                    response.send(patentsRecommendations);
                } else {
                    console.log("WARNING: There are not any research with idResearcher " + idResearcher);
                    response.sendStatus(404); // not found
                }
            }
        }).limit(3);
    }
});

module.exports = router;