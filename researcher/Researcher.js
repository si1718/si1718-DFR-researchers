var mongoose = require('mongoose');  
var ResearcherSchema = new mongoose.Schema({  
  rid: String,
  name: String,
  orcid: String,
  researcherID: String,
  investigationLink: String,
  group: String,
  unit: String,
  professionalSituation: String
});
mongoose.model('Researcher', ResearcherSchema);

module.exports = mongoose.model('Researcher');