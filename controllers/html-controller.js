var bodyParser = require('body-parser')
// var mysql = require('mysql');
var moment = require('moment');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

// var userModel = require('../models/datastore-user-model')()

// TO BE DELETED
// var allModel = require('../models/all-model');
var Model = require('../models/mongo-all-model');

// var con = mysql.createConnection({
// 	host: "localhost",
// 	user: "root",
// 	password: "pat@ncsv27",
// 	database: "freemie"
// });

// con.connect(function(err){
// 	if(!err) {
// 	 console.log("Database is connected ... \n\n");  
// 	} else {
// 	 console.log("Error connecting database ... \n\n");  
// 	}
// });

// con.query('USE freemie');

// var siteName = "localhost:3000";

module.exports = function(app) {

	// // ------------ FOR USER PROFILE -------------
	app.get('/user/:id', function(req, res) {
		if(!req.isAuthenticated()) {
			res.redirect('/signin');
		} else {
			var other_user = req.params;
			var user = req.user;
			if(user !== undefined) {
				user = user.toJSON();
			}
			// console.log("HELLO1");
			// console.log(other_user);
			// console.log(user);
			var mine = other_user.id == user._id;
			// // MODEL METHOD
			var data = {};
			Model.User.findOne({_id: other_user.id}).lean().exec(function(err, other_user_specs) {
				console.log(other_user_specs);
				data.otherUser = other_user_specs;
				Model.Item.find({giver_id: other_user.id}).lean().exec(function(err, items) {
					console.log(items);
					console.log("HELLO2")
					for (var i=0; i<items.length; i++) {
						console.log("HELLO3")
						console.log(i);
						var numberOfWants = 0;
						var wantedByUser = false;
						for (var j=0; j<items[i].wantedBy.length; j++) {
							console.log(j);
							if (items[i].wantedBy[j].userId == user._id) {
								wantedByUser = true;
							}
							numberOfWants += 1;
						}
						console.log(items[i]);
						console.log("HELELE");
						console.log(numberOfWants);
						console.log(wantedByUser);
						items[i].numberofWants = numberOfWants;
						console.log(items);
						items[i].wantedByUser = wantedByUser;
						console.log(items);
						console.log("HELLOOOO")
					}
					console.log(items);
					data.otherUserItemsOwned = items;
					var allItemsWanted = [];
					for (var l=0; l<other_user_specs.want.length; l++) {
						allItemsWanted.push(other_user_specs.want[l].itemId);
					}
					console.log(allItemsWanted);
					Model.Item.find({_id: {$in: allItemsWanted}}).lean().exec(function(err, other_user_wants) {
						// console.log(other_user_wants);
						for (var i=0; i<other_user_wants.length; i++) {
							// console.log("HELLO4")
							// console.log(i);
							var numberOfWants = 0;
							var wantedByUser = false;
							for (var j=0; j<other_user_wants[i].wantedBy.length; j++) {
								// console.log(j);
								if (other_user_wants[i].wantedBy[j].userId == user._id) {
									wantedByUser = true;
								}
								numberOfWants += 1;
							}
							console.log(numberOfWants);
							console.log(wantedByUser);
							other_user_wants[i].numberofWants = numberOfWants
							other_user_wants[i].wantedByUser = true;
						}
						data.otherUserItemsWanted = other_user_wants;
						// console.log("3");
						// console.log(data);
						res.render('userprofile2', {data: data, mine: mine, user: user});
					});
				});
			});
			
			
			

			// new allModel.User({id: other_user.id}).fetch().then(function(model1) {
			// 	data.otherUser = model1.toJSON();
			// 	// new allModel.Item().query({where: {giver_id: other_user.id}}).fetchAll({withRelated: ['wantedBy', { 'wantedBy': function (qb) { qb.where({user_id: user.id});}}]}).then( function(model2) {
			// 	new allModel.Item().query({where: {giver_id: other_user.id}}).fetchAll({withRelated: ['wantedBy']}).then( function(model2) {
			// 		var ownedModel = model2.toJSON();
			// 		for (var i = 0; i < ownedModel.length; i++) {
			// 			var wantedBy = ownedModel[i].wantedBy;
			// 			var wantedByUser = false;
			// 			var numberofWants = 0;
			// 			for (var j = 0; j < wantedBy.length; j++) {
			// 				if (wantedBy[j].user_id == user.id) {
			// 					wantedByUser = true;
			// 				};
			// 				numberofWants += 1;
			// 			};
			// 			ownedModel[i].wantedByUser = wantedByUser;
			// 			ownedModel[i].numberofWants = numberofWants;
			// 		};
			// 		data.otherUserItemsOwned = ownedModel;
			// 		new allModel.Want().query({where:{user_id: other_user.id}}).fetchAll({withRelated: ['what']}).then( function(model3) {					
			// 			var wantedModel = model3.toJSON();
			// 			var itemPromises = [];
			// 			for (var k = 0; k < wantedModel.length; k++) {
			// 				var wantedItem = wantedModel[k];
			// 				itemPromises.push(new allModel.Want().query({where:{item_id: wantedItem.item_id}}).fetchAll().then( function(model4) {
			// 					var itemModel = model4.toJSON()
			// 					var count = itemModel.length;
			// 					var wantedByUser = false;
			// 					var ownedByUser = false;
			// 					for (var j = 0; j < count; j++) {
			// 						if (itemModel[j].user_id == user.id) {
			// 							wantedByUser = true;
			// 						}
			// 					};
			// 					return [count, wantedByUser];
			// 				}));
			// 			};
			// 			Promise.all(itemPromises).then(values => {
			// 				for (var i = 0; i < wantedModel.length; i++) {
			// 					wantedModel[i].numberofWants = values[i][0];
			// 					wantedModel[i].wantedByUser = values[i][1];
			// 				};
			// 				data.otherUserItemsWanted = wantedModel;
			// 				res.render('userprofile2', {data: data, mine: mine, user: user});
			// 			});
			// 		});
			// 	});
			// });
		};
	});


	// // ------------ FOR POSTING ITEMS --------------

	app.get('/postitem', function(req, res) {
		if(!req.isAuthenticated()) {
			res.redirect('/signin');
		} else {
			var user = req.user;
			if(user !== undefined) {
				user = user.toJSON();
			}
			res.render('postitem2', {user: user});
		};
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
	app.get('/', function(req, res, next) {
		// if not signed in, direct to signin page.
		if(!req.isAuthenticated()) {
			res.redirect('/signin');
		} else {
			// get user account of signed in user.
			var user = req.user;
			if(user !== undefined) {
				user = user.toJSON();
			}
			Model.Item.find({ giver_id: {$ne: user._id} }).populate('giver_id').populate('taker_id').exec(function(err, itemrows) {
				// console.log(itemrows);
				if (err) {
					console.log('Error in Index Page Item Query: '+err)
				};
				for (var i=0; i<itemrows.length; i++) {
					itemrows[i].wantedByUser = false;
					for (var j=0; j< itemrows[i].wantedBy.length; j++) {
						console.log(user._id)
						if (itemrows[i].wantedBy[j].userId == user._id) {
							itemrows[i].wantedByUser = true;
						}
					}
				}
				res.render('index2', {itemrows: itemrows, title: 'Home', user: user});
			});
			// var item_query = "SELECT p4.total_wants, p3.item_id as wanted_id, p2.username as username, p1.id as item_id, p2.id as user_id, p1.title as title, p1.time_posted as time_posted, p1.giver_id as giver_id, p1.description as description, p1.photo as photo FROM item as p1 LEFT JOIN user as p2 on p2.id = p1.giver_id LEFT JOIN (SELECT * FROM want where user_id = " + user_id + ") as p3 on p3.item_id = p1.id LEFT JOIN (SELECT COUNT(*) as total_wants, item_id FROM want GROUP BY item_id) as p4 on p4.item_id = p1.id where p1.giver_id != " + user_id + " and p1.taker_id is NULL ORDER BY p1.id desc";

			// con.query(item_query, function(err, itemrows) {
			// 	console.log(itemrows)
			// 	res.render('index2', {itemrows: itemrows, title: 'Home', user: user});
			// });
		};
	});

	// item page
	app.get('/item/:id', function(req, res) {
		if(!req.isAuthenticated()) {
			res.redirect('/signin');
		} else {
			var item_id = req.params.id;
			var user = req.user;
			if(user !== undefined) {
				user = user.toJSON();
			}
			Model.Item.findOne({ _id: item_id}).populate('giver_id').exec(function(err, itemrows) {
				console.log("2");
				console.log(itemrows);
				res.render('itemprofile', {user: user, itemrows: itemrows});
			})
			// var item_query = "SELECT p2.username as username, p2.id as user_id, p1.id as item_id, p1.title as title, p1.time_posted as time_posted, p1.giver_id as giver_id, p1.description as description, p1.photo as photo FROM item as p1 LEFT JOIN user as p2 on p2.id = p1.giver_id where p1.id = " + item_id;
			// con.query(item_query, function(err, itemrows) {
			// });
		};
	});

	// post want item
	app.post('/item/:id/dowant/:toid', function(req, res, next) {
		if(!req.isAuthenticated()) {
			res.redirect('/signin');
		} else {
			var item_id = req.params.id;
			var user = req.user;
			var toid = req.params.toid;
			if(user !== undefined) {
				user = user.toJSON();
			}
			// console.log(user._id);
			Model.Item.findOne({ "wantedBy.userId": user._id, _id: item_id}, function(err, item) {
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
					Model.Item.findOneAndUpdate({ _id: item_id }, {$addToSet: {wantedBy: {userId: user._id}}}, function (err, doc){
						console.log(err);
						console.log(doc);
						if (toid == 0) {
							res.redirect('/');
						} else {
							res.redirect('/user/' + toid);
						};
					});
				}
			});
			// Model.Item.findOne({'username': user.username}, function(err, existinguser) {
			// 	var item_id = req.params.id;
			// 	var user = req.user;

			// 	var newItem = new Model.Item();
			// 	newItem.username = user.username;
			// 	newItem.password = hash;
			// 	newItem.first_name = user.firstname;
			// 	newItem.last_name = user.lastname; 
			// 	newItem.profile_pic = user.profilepic; 
			// 	newItem.email = user.email;

			// 	item = new allModel.Item({giver_id: user.id, id: item_id}).fetch();
			// 	return item.then(function(myItemModel) {
			// 		if (myItemModel) {
			// 			res.redirect('/')
			// 		}
			// 		else {
			// 			if(user !== undefined) {
			// 				user = user.toJSON();
			// 			}
			// 			wantPromise = new allModel.Want({user_id: user.id, item_id: item_id}).fetch();
			// 			return wantPromise.then(function(model) {
			// 				if (model) {
			// 					res.redirect('/');
			// 				} else {
			// 					var postWant = new allModel.Want({item_id: item_id, user_id: user.id});
			// 					postWant.save();
			// 					var toid = req.params.toid;
			// 					if (toid == 0) {
			// 						res.redirect('/');
			// 					} else {
			// 						res.redirect('/user/' + toid);
			// 					};
			// 				};
			// 			});
			// 		};
			// 	});
			// });
		};
	});

	// post unwant item
	app.post('/item/:id/dounwant/:toid', function(req, res, next) {
		if(!req.isAuthenticated()) {
			res.redirect('/signin');
		} else {
			var item_id = req.params.id;
			var user = req.user;
			var toid = req.params.toid;
			if(user !== undefined) {
				user = user.toJSON();
			}

			Model.Item.findOne({ "wantedBy.userId": user._id, _id: item_id}, function(err, item) {
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
					Model.Item.update({ _id: item_id }, {$pull: {wantedBy: {userId: user._id}}}, function (err, doc){
						console.log(err);
						console.log(doc);
						if (toid == 0) {
							res.redirect('/');
						} else {
							res.redirect('/user/' + toid);
						};
					});
				}
			});
			// wantPromise = new allModel.Want({user_id: user.id, item_id: item_id}).fetch();
			// return wantPromise.then(function(model) {
			// 	if (model) {
			// 		model.destroy();
			// 	};
			// 	var toid = req.params.toid;
			// 	if (toid == 0) {
			// 		res.redirect('/');
			// 	} else {
			// 		res.redirect('/user/' + toid);
			// 	};
			// });
		};
	});

};