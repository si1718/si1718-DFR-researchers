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
},{ collection : 'wordsCloud' });
mongoose.model('WordsCloud', WordsCloudSchema);

module.exports = mongoose.model('WordsCloud');