var mongoose = require('mongoose');  
var DepartmentsCalculatedSchema = new mongoose.Schema({  
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
},{ collection : 'departmentsCalculated' });
mongoose.model('DepartmentsCalculated', DepartmentsCalculatedSchema);

module.exports = mongoose.model('DepartmentsCalculated');