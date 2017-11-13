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
    type: String,
    validate: {
      validator: function(v) {
        return /^[9|6]{1}([\d]{2}[-]*){3}[\d]{2}$/.test(v);
      },
      message: '{VALUE} is not a valid phone number!'
    },
    required: [true, 'Phone number required']
  },
  orcid: String,
  researcherID: String,
  investigationLink: String,
  group: {
    type: String,
    required: [true, 'Group required']
  },
  unit: {
    type: String,
    required: [true, 'Departament/Unit required']
  },
  professionalSituation: {
    type: String,
    required: [true, 'Professional Situation required']
  }
});
mongoose.model('Researcher', ResearcherSchema);

module.exports = mongoose.model('Researcher');