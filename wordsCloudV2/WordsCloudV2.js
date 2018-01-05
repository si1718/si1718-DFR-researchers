var mongoose = require('mongoose');  
var WordsCloudSchema = new mongoose.Schema({  
  createdAt: {
    type: String
  },
  text: {
    type: String
  },
  weight: {
    type: Number
  }
},{ collection : 'wordsCloudV2' });
mongoose.model('WordsCloudV2', WordsCloudSchema);

module.exports = mongoose.model('WordsCloudV2');