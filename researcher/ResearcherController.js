var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
var researcherModel = require('./Researcher');

/* Método GET que devuelve todos los investigadores */
router.get('/', function (request, response) {
    console.log("INFO: New GET request to /researchers");
    researcherModel.find({}, function (err, researchers) {
        
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending researchers: " + JSON.stringify(researchers, 2, null));
            response.send(researchers);
        }
    });
});


/* Método GET que devuelve todos los investigadores */
router.get('/researchers', function (request, response) {
    console.log("INFO: New GET request to /researchers");
    researcherModel.find({}, function (err, researchers) {
        
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending researchers: " + JSON.stringify(researchers, 2, null));
            response.send(researchers);
        }
    });
});


/* Método GET que devuelve todos los investigadores filtrado por rid */
router.get('/researchers/:rid', function (request, response) {
    var rid = request.params.rid;
    if (!rid) {
        console.log("WARNING: New GET request to /researchers/:rid without rid, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /researchers/" + rid);
        researcherModel.findOne({rid:rid}, function (err, researcher) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
               
                if (researcher) {
                    var research = researcher; //since we expect to have exactly ONE researcher with this rid
                    console.log("INFO: Sending researcher: " + JSON.stringify(research, 2, null));
                    response.send(research);
                } else {
                    console.log("WARNING: There are not any research with rid " + rid);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});


/* Método POST que inserta un investigador en una collection */
router.post('/researchers', function (request, response) {
    var newResearcher = request.body;
    if (!newResearcher) {
        console.log("WARNING: New POST request to /researchers/ without researcher, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /researchers with body: " + JSON.stringify(newResearcher, 2, null));
        if (!newResearcher.name || !newResearcher.phone || !newResearcher.rid
            || !newResearcher.group || !newResearcher.unit || !newResearcher.professionalSituation) {
            console.log("WARNING: The researcher " + JSON.stringify(newResearcher, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            researcherModel.findOne({"rid": newResearcher.rid}, function (err, researcherAux) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    if (researcherAux) {
                        console.log("WARNING: The researcher " + JSON.stringify(newResearcher, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding researcher " + JSON.stringify(newResearcher, 2, null));
                        
                        researcherModel.create({
                            rid: request.body.rid,
                            name: request.body.name,
                            orcid: request.body.orcid,
                            researcherID: request.body.researcherID,
                            investigationLink: request.body.investigationLink,
                            group: request.body.group,
                            unit: request.body.unit,
                            professionalSituation: request.body.professionalSituation
                            
                        }, 
                        function (err, user) {
                            if (err) return response.status(500).send("There was a problem adding the information to the database.");
                            response.sendStatus(201); // created
                        });
                    }
                }
            });
        }
    }
});


/* Método POST sobre un recurso */
router.post('/researchers/:rid', function (request, response) {
    var rid = request.params.rid;
    console.log("WARNING: New POST request to /researchers/" + rid + ", sending 405...");
    response.sendStatus(405); // method not allowed
});



/* Método PUT sobre un recurso para actualizar un investigador */
router.put('/researchers/:rid', function (request, response) {
    var updatedResearcher = request.body;
    var rid = request.params.rid;
    if (!updatedResearcher) {
        console.log("WARNING: New PUT request to /researchers/ without researcher, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /researchers/" + rid + " with data " + JSON.stringify(updatedResearcher, 2, null));
        if (!updatedResearcher.name || !updatedResearcher.phone || !updatedResearcher.rid
            || !updatedResearcher.group || !updatedResearcher.unit || !updatedResearcher.professionalSituation) {
            console.log("WARNING: The researcher " + JSON.stringify(updatedResearcher, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            researcherModel.findOneAndUpdate({rid: rid}, updatedResearcher, function (err, researcher) {
                if (err){
                    console.error('WARNING: Error Modifying data from DB');
                    return response.sendStatus(500); // internal server error
                } else {
                    if (researcher) {
                        console.log("INFO: Modifying researcher with rid " + rid + " with data " + JSON.stringify(updatedResearcher, 2, null));
                        response.sendStatus(200); // updated
                    } else {
                        console.log("WARNING: There are not any researcher with rid " + rid);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});


/* Método PUT sobre una collection de investigadores */
router.put('/researchers', function (request, response) {
    console.log("WARNING: New PUT request to /researchers, sending 405...");
    response.sendStatus(405); // method not allowed
});


/* Método DELETE sobre una collection de investigadores */
router.delete('/researchers', function (request, response) {
    console.log("INFO: New DELETE request to /researchers");
    researcherModel.remove({}, function (err, output) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (output.result.n > 0) {
                console.log("INFO: All the researchers (" + output + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no researchers to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});


/* Método DELETE sobre un investigador */
router.delete('/researchers/:rid', function (request, response) {
    var rid = request.params.rid;
    if (!rid) {
        console.log("WARNING: New DELETE request to /researchers/:rid without rid, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /researchers/" + rid);
        researcherModel.findOneAndRemove({rid: rid}, function (err, output) {
            if (err){
                console.error('WARNING: Error removing data from DB');
                return response.sendStatus(500); // internal server error
            }else{
                console.log("INFO: researchers removed: " + output);
                if (output) {
                    console.log("INFO: The researcher with rid " + rid + " has been succesfully deleted, sending 204...");
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