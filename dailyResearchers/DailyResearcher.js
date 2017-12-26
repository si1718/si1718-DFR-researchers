var mongoose = require('mongoose');  
var DailyResearcherSchema = new mongoose.Schema({  
  idResearcher: {
    type: String,
    required: [true, 'idResearcher required']
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
  link: String,
  idGroup: {
    type: String
  },
  professionalSituation: {
    type: String
  },
  keywords: {
    type: String
  },
  viewURL: {
    type: String
  },
  idDepartment: {
    type: String
  },
  departmentViewURL: {
    type: String
  },
  departmentName: {
    type: String
  }
},{ collection : 'dailyResearchers' });
mongoose.model('DailyResearcher', DailyResearcherSchema);

module.exports = mongoose.model('DailyResearcher');