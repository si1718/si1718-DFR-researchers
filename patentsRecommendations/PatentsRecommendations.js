var mongoose = require('mongoose');  
var PatentsRecommendationsSchema = new mongoose.Schema({  
  idResearcher: {
    type: String
  },
  researchers: {
    type: String
  },
  createdAt: {
    type: String
  }
},{ collection : 'patentsRecommendations' });
mongoose.model('PatentsRecommendations', PatentsRecommendationsSchema);

module.exports = mongoose.model('PatentsRecommendations');