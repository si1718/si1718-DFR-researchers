var mongoose = require('mongoose');  
var ResearchersCalculatedSchema = new mongoose.Schema({  
  _id: {
    type: String
  },
  createdAt: {
    type: String
  },
  researchersWithORCID: {
    type: Number
  },
  researchersWithoutORCID: {
    type: Number
  }
},{ collection : 'researchersCalculated' });
mongoose.model('ResearchersCalculated', ResearchersCalculatedSchema);

module.exports = mongoose.model('ResearchersCalculated');