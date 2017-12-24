var mongoose = require('mongoose');  
var RecommendationsSchema = new mongoose.Schema({  
  idResearcher: {
    type: String
  },
  researchers: {
    type: String
  },
  createdAt: {
    type: String
  }
},{ collection : 'recommendations' });
mongoose.model('Recommendations', RecommendationsSchema);

module.exports = mongoose.model('Recommendations');