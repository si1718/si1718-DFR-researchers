var express = require('express');
var app = express();
var db = require('./db');
var path = require('path');
var cors = require('cors');

global.__root   = __dirname + '/'; 

app.use(cors());

app.get('/api', function (req, res) {
  res.status(200).send('API works.');
});

var UserController = require(__root + 'user/UserController');
app.use('/api/users', UserController);

var AuthController = require(__root + 'auth/AuthController');
app.use('/api/auth', AuthController);

var ResearcherController = require(__root + 'researcher/ResearcherController');
app.use('/api/v1', ResearcherController);

var ResearcherSecureController = require(__root + 'researcher/ResearcherSecureController');
app.use('/api/v1.1', ResearcherSecureController);

/* API CÁLCULOS */

var TweetCalculatedController = require(__root + 'tweetCalculated/TweetCalculatedController');
app.use('/api/v1', TweetCalculatedController);

var TweetLanguageCalculatedController = require(__root + 'tweetLanguageCalculated/TweetLanguageCalculatedController');
app.use('/api/v1', TweetLanguageCalculatedController);

var GroupsCalculatedController = require(__root + 'groupsCalculated/GroupsCalculatedController');
app.use('/api/v1', GroupsCalculatedController);

var DepartmentsCalculatedController = require(__root + 'departmentsCalculated/DepartmentsCalculatedController');
app.use('/api/v1', DepartmentsCalculatedController);

var ResearchersCalculatedController = require(__root + 'researchersCalculated/ResearchersCalculatedController');
app.use('/api/v1', ResearchersCalculatedController);

/* SISTEMA DE RECOMENDACION */

var RecommendationsController = require(__root + 'recommendations/RecommendationsController');
app.use('/api/v1', RecommendationsController);

/* WEB SCRAPING CON INVESTIGADORES NUEVOS */

var DailyResearcherController = require(__root + 'dailyResearchers/DailyResearcherController');
app.use('/api/v1', DailyResearcherController);

app.use(express.static(path.join(__dirname, "public")));

module.exports = app;