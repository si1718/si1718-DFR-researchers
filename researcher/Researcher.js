var mongoose = require('mongoose');  
var ResearcherSchema = new mongoose.Schema({  
  idResearcher: {
    type: String,
    required: [true, 'idResearcher required'],
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Name required']
  },
  phone: {
    type: String
  },
  orcid: String,
  researcherId: String,
  investigationLink: String,
  group: {
    type: String
  },
  unit: {
    type: String
  },
  professionalSituation: {
    type: String
  }
});
mongoose.model('Researcher', ResearcherSchema);

module.exports = mongoose.model('Researcher');