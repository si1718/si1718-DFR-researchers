var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var dailyResearcherModel = require('./DailyResearcher');

/* configura dentro de express el middleware bodyparser json */
router.use(bodyParser.json());

/* Método GET que devuelve los investigadores que se han encontrado recientemente y han sido almacenados en la collection dailyResearchers. */
router.get('/dailyResearchers', function (request, response) {
    var query = {};
    
    console.log("INFO: New GET request to /dailyResearchers");
    dailyResearcherModel.find(query, function (err, dailyResearchers) {
        
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending dailyResearchers: " + JSON.stringify(dailyResearchers, 2, null));
            response.send(dailyResearchers);
        }
    });
});

/* Método GET que devuelve todos los investigadores filtrado por idResearcher */
router.get('/dailyResearchers/:idResearcher', function (request, response) {
    var idResearcher = request.params.idResearcher;
    if (!idResearcher) {
        console.log("WARNING: New GET request to /researchers/:idResearcher without idResearcher, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /researchers/" + idResearcher);
        dailyResearcherModel.findOne({idResearcher:idResearcher}, function (err, researcher) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
               
                if (researcher) {
                    //since we expect to have exactly ONE researcher with this idResearcher
                    console.log("INFO: Sending researcher: " + JSON.stringify(researcher, 2, null));
                    response.send(researcher);
                } else {
                    console.log("WARNING: There are not any research with idResearcher " + idResearcher);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

/* Método DELETE sobre un investigador */
router.delete('/dailyResearchers/:idResearcher', function (request, response) {
    var idResearcher = request.params.idResearcher;
    if (!idResearcher) {
        console.log("WARNING: New DELETE request to /dailyResearchers/:idResearcher without idResearcher, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /dailyResearchers/" + idResearcher);
        dailyResearcherModel.findOneAndRemove({idResearcher: idResearcher}, function (err, output) {
            if (err){
                console.error('WARNING: Error removing data from DB');
                return response.sendStatus(500); // internal server error
            }else{
                console.log("INFO: researchers removed: " + output);
                if (output) {
                    console.log("INFO: The researcher with idResearcher " + idResearcher + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no researchers to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

module.exports = router;