var mongoose = require('mongoose');  
var KeywordsSchema = new mongoose.Schema({  
  keywords: {
    type: String
  },
  idKeywords: {
    type: String
  }
},{ collection : 'keywords' });
mongoose.model('Keywords', KeywordsSchema);

module.exports = mongoose.model('Keywords');