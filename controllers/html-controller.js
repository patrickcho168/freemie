var bodyParser = require('body-parser')
var moment = require('moment');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

var Model = require('../models/mongo-all-model');

module.exports = function(app) {

	function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated())
		return next();
	else
		res.redirect('/signin');
	}

	// // ------------ FOR USER PROFILE -------------

	app.get('/user/:id', ensureAuthenticated, function(req, res) {
		var other_user = req.params;
		var user = req.user;
		if(user !== undefined) {
			user = user.toJSON();
		}
		var mine = other_user.id == user._id;
		var data = {};
		Model.User.findOne({_id: other_user.id}).lean().exec(function(err, other_user_specs) {
			data.otherUser = other_user_specs;
			Model.Item.find({giver_id: other_user.id, taker_id: null}).populate('giver_id').lean().exec(function(err, items) {
				for (var i=0; i<items.length; i++) {
					var numberOfWants = 0;
					var wantedByUser = false;
					if (mine) {
						items[i].ownedByUser = true;
					} else {
						items[i].ownedByUser = false;
					}
					for (var j=0; j<items[i].wantedBy.length; j++) {
						console.log(j);
						if (items[i].wantedBy[j].userId == user._id) {
							wantedByUser = true;
						}
						numberOfWants += 1;
					}
					items[i].numberofWants = numberOfWants;
					items[i].wantedByUser = wantedByUser;
				}
				data.otherUserItemsOwned = items;
				var allItemsWanted = [];
				for (var l=0; l<other_user_specs.want.length; l++) {
					allItemsWanted.push(other_user_specs.want[l].itemId);
				}
				Model.Item.find({_id: {$in: allItemsWanted}, taker_id: null}).populate('giver_id').lean().exec(function(err, other_user_wants) {
					if (other_user_wants === undefined) {
						other_user_wants = [];
					} else {
						for (var i=0; i<other_user_wants.length; i++) {
							var numberOfWants = 0;
							var wantedByUser = false;
							var ownedByUser = false;
							if (JSON.stringify(other_user_wants[i].giver_id._id) == JSON.stringify(user._id)) {
								ownedByUser = true;
							}
							for (var j=0; j<other_user_wants[i].wantedBy.length; j++) {
								if (other_user_wants[i].wantedBy[j].userId == user._id) {
									wantedByUser = true;
								}
								numberOfWants += 1;
							}
							other_user_wants[i].numberofWants = numberOfWants
							other_user_wants[i].wantedByUser = wantedByUser;
							other_user_wants[i].ownedByUser = ownedByUser;
						}
					}
					// console.log(other_user_wants);
					data.otherUserItemsWanted = other_user_wants;
					console.log(data);
					res.render('userprofile2', {data: data, mine: mine, user: user, itemrows: []});
				});
			});
		});
	});


	// // ------------ FOR POSTING ITEMS --------------

	app.get('/postitem', ensureAuthenticated, function(req, res) {
		var user = req.user;
		if(user !== undefined) {
			user = user.toJSON();
		}
		res.render('postitem2', {user: user, itemrows: []});
	});

	app.post('/postitem/check', function(req, res) {
		var item = req.body;
		console.log(item);
		console.log(req.user);
		if (item.itempic.match(/\.(jpeg|jpg|gif|png)$/) == null) {
			res.redirect('/postitem', {errorMessage: 'Photo URL is not an image.'});
		} else {
			user_id = req.user._id;
			date = moment.utc().format("YYYY-MM-DD HH:mm:ss");
			var newItem = new Model.Item();
			newItem.time_posted = date;
			newItem.title = item.itemname;
			newItem.giver_id = user_id;
			newItem.description = item.itemdesc;
			newItem.photo = item.itempic;
			newItem.save(function(err) {
	            if (err) {
	               console.log('Error in Saving User: ' + err);
	               throw err;
	            }
				newItem.save();
				res.redirect('/user/' + user_id)
			});
		};
	});

	// ------------ FOR BROWSING ITEMS ---------------

	// index page
	app.get('/', ensureAuthenticated, function(req, res, next) {
		var user = req.user;
		if(user !== undefined) {
			user = user.toJSON();
		}
		Model.Item.find({ giver_id: {$ne: user._id}, taker_id: null}).populate('giver_id').populate('taker_id').lean().exec(function(err, itemrows) {
			if (err) {
				console.log('Error in Index Page Item Query: '+err)
			};
			for (var i=0; i<itemrows.length; i++) {
				itemrows[i].wantedByUser = false;
				itemrows[i].ownedByUser = false;
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
			res.render('index2', {itemrows: itemrows, title: 'Home', user: user});
		});
	});

	// item page
	app.get('/item/:id', ensureAuthenticated, function(req, res) {
		var item_id = req.params.id;
		var user = req.user;
		if(user !== undefined) {
			user = user.toJSON();
		}
		Model.Item.findOne({ _id: item_id}).populate('giver_id').populate('wantedBy.userId').exec(function(err, itemrows) {
			if (JSON.stringify(user._id) == JSON.stringify(itemrows.giver_id._id)) {
				itemrows.ownedByUser = true;
			} else {
				itemrows.ownedByUser = false;
			}
			itemrows.wantedByUser = false;
			for (var i=0; i<itemrows.wantedBy.length; i++) {
				console.log(itemrows.wantedBy[i].userId._id);
				console.log(user._id);
				if (JSON.stringify(itemrows.wantedBy[i].userId._id) == JSON.stringify(user._id)) {
					itemrows.wantedByUser = true;
				}
			}
			res.render('itemprofile', {user: user, itemrows: itemrows});
		})
	});

	// post want item
	app.post('/item/:id/dowant/:toid', ensureAuthenticated, function(req, res, next) {
		var item_id = req.params.id;
		var user = req.user;
		var toid = req.params.toid;
		if(user !== undefined) {
			user = user.toJSON();
		}
		Model.Item.findOne({ _id: item_id, taker_id: null}, function(err, item) {
			if (item == null) {
				if (toid == 0) {
					res.redirect('/');
				} else {
					res.redirect('/user/' + toid);
				};
			}
			Model.Item.findOne({ "wantedBy.userId": user._id, _id: item_id, taker_id: null}, function(err, item) {
				console.log("1");
				console.log(item);
				if (item != null) {
					if (toid == 0) {
						res.redirect('/');
					} else {
						res.redirect('/user/' + toid);
					};
				} else {
					Model.User.update({ _id: user._id }, {$addToSet: {want: {itemId: item_id}}}, function (err, doc){
						console.log(err);
						console.log(doc);
					});
					Model.Item.findOneAndUpdate({ _id: item_id, taker_id: null }, {$addToSet: {wantedBy: {userId: user._id}}}, function (err, doc){
						console.log(err);
						console.log(doc);
						if (toid == 0) { // remain on page
							res.json({});
						} else if (toid == 1) { // go to item page
							res.redirect('/item/' + item_id);
						} else { // go to profile page
							res.redirect('/user/' + toid);
						};
					});
				}
			});
		});
	});

	// post unwant item
	app.post('/item/:id/dounwant/:toid', ensureAuthenticated, function(req, res, next) {
		var item_id = req.params.id;
		var user = req.user;
		var toid = req.params.toid;
		if(user !== undefined) {
			user = user.toJSON();
		}
		Model.Item.findOne({ _id: item_id, taker_id: null}, function(err, item) {
			if (item == null) {
				if (toid == 0) {
					res.json({});
				} else {
					res.redirect('/user/' + toid);
				};
			}
			Model.Item.findOne({ "wantedBy.userId": user._id, _id: item_id, taker_id: null}, function(err, item) {
				console.log("1");
				console.log(item);
				if (item == null) {
					if (toid == 0) {
						res.redirect('/');
					} else {
						res.redirect('/user/' + toid);
					};
				} else {
					Model.User.update({ _id: user._id }, {$pull: {want: {itemId: item_id}}}, function (err, doc){
						console.log(err);
						console.log(doc);
					});
					Model.Item.update({ _id: item_id, taker_id: null }, {$pull: {wantedBy: {userId: user._id}}}, function (err, doc){
						console.log(err);
						console.log(doc);
						if (toid == 0) {
							res.redirect('/');
						} else if (toid == 1) { // go to item page
							res.redirect('/item/' + item_id);
						} else {
							res.redirect('/user/' + toid);
						};
					});
				}
			});
		});
	});

	// for giving item
	// post unwant item
	app.post('/item/:id/dogive', ensureAuthenticated, function(req, res, next) {
		var item_id = req.params.id;
		var user = req.user;
		if(user !== undefined) {
			user = user.toJSON();
		}
		Model.Item.findOne({ _id: item_id, taker_id: null}, function(err, item) {
			if (item == null) {
				res.json({});
			}
			Model.Item.update({ _id: item_id, taker_id: null }, {taker_id: user._id}, function (err, doc){
				console.log(err);
				console.log(doc);
				res.redirect('/item/' + item_id);
			});
		});
	});

};





