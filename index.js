"use strict";
/* global __dirname */

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');

var MongoClient = require('mongodb').MongoClient;

var mdbURL = "mongodb://researchers:researchers@ds255455.mlab.com:55455/si1718-dfr-researchers";

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";

var db;


MongoClient.connect(mdbURL,{native_parser:true},function (err,database){

    if(err){
        console.log("CAN NOT CONNECT TO DB: "+err);
        process.exit(1);
    }
    
    db = database.collection("researchers");
    

    app.listen(port, () => {
        console.log("Magic is happening on port " + port);    
    });

});

var app = express();

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security



/* Método GET que devuelve todos los investigadores */
app.get(BASE_API_PATH + "/researchers", function (request, response) {
    console.log("INFO: New GET request to /researchers");
    db.find({}).toArray( function (err, researchers) {
        
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending researchers: " + JSON.stringify(researchers, 2, null));
            response.send(researchers);
        }
    });
});


/* Método GET que devuelve todos los investigadores filtrado por nombre/apellidos/ORCID/researchID */
app.get(BASE_API_PATH + "/researchers/:rid", function (request, response) {
    var rid = request.params.rid;
    if (!rid) {
        console.log("WARNING: New GET request to /researchers/:rid without rid, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /researchers/" + rid);
        db.findOne({"rid":rid}, function (err, researcher) {
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


//POST over a collection
app.post(BASE_API_PATH + "/researchers", function (request, response) {
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
            db.findOne({"rid": newResearcher.rid}, function (err, researcher) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    if (researcher) {
                        console.log("WARNING: The researcher " + JSON.stringify(newResearcher, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding researcher " + JSON.stringify(newResearcher, 2, null));
                        db.insert(newResearcher);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//POST over a single resource
app.post(BASE_API_PATH + "/researchers/:rid", function (request, response) {
    var rid = request.params.rid;
    console.log("WARNING: New POST request to /researchers/" + rid + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(BASE_API_PATH + "/researchers", function (request, response) {
    console.log("WARNING: New PUT request to /researchers, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
app.put(BASE_API_PATH + "/researchers/:rid", function (request, response) {
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
            db.findOne({rid:rid}, function (err, researcher) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    
                    if (researcher) {
                        db.update({rid: rid}, updatedResearcher);
                        console.log("INFO: Modifying researcher with rid " + rid + " with data " + JSON.stringify(updatedResearcher, 2, null));
                        response.send(updatedResearcher); // return the updated researcher
                    } else {
                        console.log("WARNING: There are not any researcher with rid " + rid);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});


//DELETE over a collection
app.delete(BASE_API_PATH + "/researchers", function (request, response) {
    console.log("INFO: New DELETE request to /researchers");
    db.deleteMany({}, {multi: true}, function (err, output) {
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


//DELETE over a single resource
app.delete(BASE_API_PATH + "/researchers/:rid", function (request, response) {
    var rid = request.params.rid;
    if (!rid) {
        console.log("WARNING: New DELETE request to /researchers/:rid without rid, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /researchers/" + rid);
        db.deleteOne({"rid": rid}, {}, function (err, output) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: researchers removed: " + output);
                if (output.result.n === 1) {
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