var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var keywordsModel = require('./Keywords');

/* configura dentro de express el middleware bodyparser json */
router.use(bodyParser.json());

/* Método GET que devuelve todos los departamentos con más de 100 investigadores */
router.get('/keywords', function (request, response) {
    var query = {};
    
    console.log("INFO: New GET request to /keywords");
    keywordsModel.find(query, function (err, keywords) {
        
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending keywords: " + JSON.stringify(keywords, 2, null));
            response.send(keywords);
        }
    });
});

/* Método PUT sobre un recurso para actualizar las keywords */
router.put('/keywords/:id', function (request, response) {
    var updatedKeywords = request.body;
    var idKeywords = request.body.idKeywords;
    if (!updatedKeywords) {
        console.log("WARNING: New PUT request to /keywords/ without id, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /keywords/" + idKeywords + " with data " + JSON.stringify(updatedKeywords, 2, null));
        if (!updatedKeywords._id || !updatedKeywords.keywords) {
            console.log("WARNING: The id " + JSON.stringify(updatedKeywords, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            keywordsModel.findOneAndUpdate({idKeywords:idKeywords}, updatedKeywords, function (err, keywords) {
                if (err){
                    console.error('WARNING: Error Modifying data from DB');
                    return response.sendStatus(500); // internal server error
                } else {
                    if (keywords) {
                        console.log("INFO: Modifying researcher with idKeywords " + idKeywords + " with data " + JSON.stringify(updatedKeywords, 2, null));
                        response.sendStatus(200); // updated
                    } else {
                        console.log("WARNING: There are not any researcher with idKeywords " + idKeywords);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});


/* Método PUT sobre una collection de keywords */
router.put('/keywords', function (request, response) {
    console.log("WARNING: New PUT request to /keywords, sending 405...");
    response.sendStatus(405); // method not allowed
});

module.exports = router;