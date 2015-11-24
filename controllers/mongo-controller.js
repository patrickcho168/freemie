var mongoose = require('mongoose');
var mongodb_url = 'mongodb://130.211.158.29:27017/mydb';

mongoose.connect(mongodb_url)

module.exports.DB = mongoose;