
var Model = require('../models/mongo-all-model');

var search = function(req, res) {
	var searchKey = req.query.searchKey;
	Model.Item.find({'title': {$regex: '.*' + searchKey + ".*", $options: 'i'}},function(err, items) {
		if(!items) {
			res.send("error");
		}
		res.send(items);
	});
}

module.exports.search = search;