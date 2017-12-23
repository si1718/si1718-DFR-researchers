var mongoose = require('mongoose');  
var TweetLanguageCalculatedSchema = new mongoose.Schema({  
  createdAt: {
    type: String
  },
  language: {
    type: String
  },
  date: {
    type: String
  },
  count: {
    type: Number
  }
},{ collection : 'tweetsLanguageCalculated' });
mongoose.model('TweetLanguageCalculated', TweetLanguageCalculatedSchema);

module.exports = mongoose.model('TweetLanguageCalculated');