var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var researcherModel = require('./Researcher');
var VerifyToken = require(__root + 'auth/VerifyToken');

/* configura dentro de express el middleware bodyparser json */
router.use(bodyParser.json());

/* Método GET que devuelve todos los investigadores */
router.get('/researchers', VerifyToken, function (request, response) {
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


/* Método GET que devuelve todos los investigadores filtrado por idResearcher */
router.get('/researchers/:idResearcher', VerifyToken, function (request, response) {
    var idResearcher = request.params.idResearcher;
    if (!idResearcher) {
        console.log("WARNING: New GET request to /researchers/:idResearcher without idResearcher, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /researchers/" + idResearcher);
        researcherModel.findOne({idResearcher:idResearcher}, function (err, researcher) {
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


/* Método POST que inserta un investigador en una collection */
router.post('/researchers', VerifyToken, function (request, response) {
    var newResearcher = request.body;
    if (!newResearcher) {
        console.log("WARNING: New POST request to /researchers/ without researcher, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /researchers with body: " + JSON.stringify(newResearcher, 2, null));
        if (!newResearcher.name || !newResearcher.orcid) {
            console.log("WARNING: The researcher " + JSON.stringify(newResearcher, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            researcherModel.findOne({idResearcher: newResearcher.orcid}, function (err, researcherAux) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    if (researcherAux) {
                        console.log("WARNING: The researcher " + JSON.stringify(newResearcher, 2, null) + " already exists, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding researcher " + JSON.stringify(newResearcher, 2, null));
                        
                        researcherModel.create({
                            idResearcher: request.body.orcid,
                            name: request.body.name,
                            phone: request.body.phone,
                            orcid: request.body.orcid,
                            researcherId: request.body.researcherId,
                            link: request.body.link,
                            idGroup: request.body.idGroup,
                            professionalSituation: request.body.professionalSituation,
                            keywords: request.body.keywords,
                            viewURL: request.body.viewURL,
                            idDepartment: request.body.idDepartment,
                            departmentViewURL: request.body.departmentViewURL,
                            departmentName: request.body.departmentName
                            
                        }, 
                        function (err, user) {
                            if (err) return response.status(500).send(err.message);
                            response.sendStatus(201); // created
                        });
                    }
                }
            });
        }
    }
});


/* Método POST sobre un recurso */
router.post('/researchers/:idResearcher', VerifyToken, function (request, response) {
    var idResearcher = request.params.idResearcher;
    console.log("WARNING: New POST request to /researchers/" + idResearcher + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


/* Método PUT sobre un recurso para actualizar un investigador */
router.put('/researchers/:idResearcher', VerifyToken, function (request, response) {
    var updatedResearcher = request.body;
    var idResearcher = request.params.idResearcher;
    if (!updatedResearcher) {
        console.log("WARNING: New PUT request to /researchers/ without researcher, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /researchers/" + idResearcher + " with data " + JSON.stringify(updatedResearcher, 2, null));
        if (!updatedResearcher.name || !updatedResearcher.idResearcher) {
            console.log("WARNING: The researcher " + JSON.stringify(updatedResearcher, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            researcherModel.findOneAndUpdate({idResearcher: idResearcher}, updatedResearcher, function (err, researcher) {
                if (err){
                    console.error('WARNING: Error Modifying data from DB');
                    return response.sendStatus(500); // internal server error
                } else {
                    if (researcher) {
                        console.log("INFO: Modifying researcher with idResearcher " + idResearcher + " with data " + JSON.stringify(updatedResearcher, 2, null));
                        response.sendStatus(200); // updated
                    } else {
                        console.log("WARNING: There are not any researcher with idResearcher " + idResearcher);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});


/* Método PUT sobre una collection de investigadores */
router.put('/researchers', VerifyToken, function (request, response) {
    console.log("WARNING: New PUT request to /researchers, sending 405...");
    response.sendStatus(405); // method not allowed
});


/* Método DELETE sobre una collection de investigadores */
router.delete('/researchers', VerifyToken, function (request, response) {
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
router.delete('/researchers/:idResearcher', VerifyToken, function (request, response) {
    var idResearcher = request.params.idResearcher;
    if (!idResearcher) {
        console.log("WARNING: New DELETE request to /researchers/:idResearcher without idResearcher, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /researchers/" + idResearcher);
        researcherModel.findOneAndRemove({idResearcher: idResearcher}, function (err, output) {
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


/* ************************************* API GRAPHS ****************************************** */
/* Método GET que devuelve todos los departamentos que se encuentran en la base de datos junto al número de investigadores que contiene */
router.get('/departmentsGraph', VerifyToken, function (request, response) {
    console.log("INFO: New GET request to /departmentsGraph");
    
    var aggregation = [
        {
            "$match": {
                "idDepartment": { "$exists": true, "$ne": null }
            }
        },
        {
            "$match": {
                "idDepartment": { "$exists": true, "$ne": "" }
            }
        },
        {
            $group: {_id: "$idDepartment",count: {$sum: 1} }
        }
    ];
    
    researcherModel.aggregate(aggregation, function(err, departments){
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending departments: " + JSON.stringify(departments, 2, null));
            response.send(departments);
        }
    });
});


/* Método GET que devuelve todos los grupos que se encuentran en la base de datos junto al número de investigadores que contiene */
router.get('/groupsGraph', VerifyToken, function (request, response) {
    console.log("INFO: New GET request to /groupsGraph");
    
    var aggregation = [
        {
            "$match": {
                "idGroup": { "$exists": true, "$ne": null }
            }
        },
        {
            "$match": {
                "idGroup": { "$exists": true, "$ne": "" }
            }
        },
        {
            $group: {_id: "$idGroup",count: {$sum: 1} }
        }
    ];
    
    researcherModel.aggregate(aggregation, function(err, groups){
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending groups: " + JSON.stringify(groups, 2, null));
            response.send(groups);
        }
    });
});


module.exports = router;