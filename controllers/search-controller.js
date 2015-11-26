
var Model = require('../models/mongo-all-model');

var search = function(req, res) {
	var user = req.user;
	if(user !== undefined) {
		user = user.toJSON();
	}
	var searchKey = req.query.searchKey;
	Model.Item.find({'title': {$regex: '.*' + searchKey + ".*", $options: 'i'}, giver_id: {$ne: user._id}}).populate('giver_id').populate('taker_id').lean().exec(function(err, itemrows) {
		if (err) {
			console.log('Error in Index Page Item Query: '+err)
		}
		if(!itemrows) {
			res.send("error");
		}
		for (var i=0; i<itemrows.length; i++) {
			itemrows[i].wantedByUser = false;
			itemrows[i].dounwant = "/item/" + itemrows[i]._id + "/dounwant/0"
			itemrows[i].dowant = "/item/" + itemrows[i]._id + "/dowant/0"
			for (var j=0; j< itemrows[i].wantedBy.length; j++) {
				console.log(user._id)
				if (itemrows[i].wantedBy[j].userId == user._id) {
					itemrows[i].wantedByUser = true;
				}
			}
		}
		console.log(itemrows);
		res.send(itemrows);
	});
}

module.exports.search = search;