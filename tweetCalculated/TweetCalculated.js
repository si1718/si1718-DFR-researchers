var mongoose = require('mongoose');  
var TweetCalculatedSchema = new mongoose.Schema({  
  createdAt: {
    type: String
  },
  keyword: {
    type: String
  },
  date: {
    type: String
  },
  count: {
    type: Number
  }
},{ collection : 'tweetsCalculated' });
mongoose.model('TweetCalculated', TweetCalculatedSchema);

module.exports = mongoose.model('TweetCalculated');