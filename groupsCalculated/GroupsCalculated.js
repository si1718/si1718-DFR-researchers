var mongoose = require('mongoose');  
var GroupsCalculatedSchema = new mongoose.Schema({  
  _id: {
    type: String
  },
  createdAt: {
    type: String
  },
  url: {
    type: String
  },
  count: {
    type: Number
  }
},{ collection : 'groupsCalculated' });
mongoose.model('GroupsCalculated', GroupsCalculatedSchema);

module.exports = mongoose.model('GroupsCalculated');