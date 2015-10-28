// This file is required by app.js. It sets up event listeners
// for the two main URL endpoints of the application - /create and /chat/:id
// and listens for socket.io messages.

// Use the gravatar module, to turn email addresses into avatar images:

var gravatar = require('gravatar');

var allModel = require('../models/all-model');

// Export a function, so that we can pass 
// the app and io instances from the app.js file:

module.exports = function(app,io){

	app.get('/user/:id/create', function(req,res){
		if(!req.isAuthenticated()) {
			res.redirect('/signin');
		} else {
			var other_user = req.params;
			var user = req.user;
			if(user !== undefined) {
				user = user.toJSON();
			};
			var mine = other_user.id == user.id;
			res.render("chatstart", {otheruser_id: other_user.id});
		};
	});

	app.post('/user/:id/create', function(req,res){
		if(!req.isAuthenticated()) {
			res.redirect('/signin');
		} else {
			var other_user = req.params;
			var user = req.user;
			if(user !== undefined) {
				user = user.toJSON();
			};
			var mine = other_user.id == user.id;
			// cannot start with chat with yourself
			if (mine) {
				res.redirect('/user/' + other_user.id);
			}
			else {
				var conv1Promise = new allModel.Conv({user1_id: user.id, user2_id: other_user.id}).fetch();
				var conv2Promise = new allModel.Conv({user1_id: other_user.id, user2_id: user.id}).fetch();

				conv1Promise.then(function(model) {
					if (model) {
						convModel1 = model.toJSON();
						res.redirect('/chat/'+convModel1.id + '/' + user.id);
					} else {
						conv2Promise.then(function(model2) {
							if (model2) {
								convModel2 = model2.toJSON();
								res.redirect('/chat/'+convModel2.id + '/' + user.id);
							}
							else {
								var createConv = new allModel.Conv({user1_id: user.id, user2_id: other_user.id});
								createConv.save().then(function(model3) {
									convModel3 = model3.toJSON();
									res.redirect('/chat/'+convModel3.id + '/' + user.id);
								});
							};
						});	
					}
				});
			};
		};
	});

	app.get('/chat/:id/:user_id', function(req,res){
		if(!req.isAuthenticated()) {
			res.redirect('/signin');
		} else {
			var chat = req.params;
			var user = req.user;
			if(user !== undefined) {
				user = user.toJSON();
			};

			// // MODEL METHOD
			new allModel.Conv({id: chat.id}).fetch().then(function(model) {
				if (model) {
					convModel = model.toJSON();
					user1_id = convModel.user1_id;
					user2_id = convModel.user2_id;
					if (user.id != user1_id && user.id != user2_id) {
						res.redirect('/');
					} else {
						new allModel.Line({id: convModel.id}).fetchAll().then(function(model2) {
							// PROCESS ALL LINES AND PRINT OUT
							new allModel.User({id: user.id}).fetch().then(function(model3) {
								userJson = model3.toJSON();
								res.render('chat');
							});
						});
					};
				} else {
					res.redirect('/');
				};
			});
		};
	});

	// Initialize a new socket.io application, named 'chat'
	var chat = io.on('connection', function (socket) {
		console.log('hello')
		// When the client emits the 'load' event, reply with the 
		// number of people in this chat room

		socket.on('load',function(data){

			var room = findClientsSocket(io,data.id);
			if(room.length === 0 ) {

				socket.emit('peopleinchat', {number: 0});
			}
			else if(room.length === 1) {

				socket.emit('peopleinchat', {
					number: 1,
					user: room[0].username,
					avatar: room[0].avatar,
					id: data
				});
			}
		});

		// When the client emits 'login', save his name and avatar,
		// and add them to the room
		socket.on('login', function(data) {

			var room = findClientsSocket(io, data.id);

			// Use the socket object to store data. Each client gets
			// their own unique socket object
			new allModel.User({id: data.user_id}).fetch().then(function(model3) {
				userJson = model3.toJSON();
				console.log(userJson);
				socket.username = userJson.first_name;
				console.log(data.id);
				socket.room = data.id;
				socket.avatar = userJson.profile_pic;


				// Add the client to the room
				socket.join(data.id);
				console.log(room);
				var usernames = [],
					avatars = [];
				
				if (room.length >= 1) {
					for (i=0; i<room.length; i++) {
						if (usernames.indexOf(room[i].username) === -1) {
							usernames.push(room[i].username);
						}
					}
				}
				if (usernames.indexOf(socket.username) === -1) {
					usernames.push(socket.username);
				}

				if (room.length >= 1) {
					for (i=0; i<room.length; i++) {
						if (avatars.indexOf(room[i].avatar) === -1) {
							avatars.push(room[i].avatar);
						}
					}
				}
				if (avatars.indexOf(socket.avatar) === -1) {
					avatars.push(socket.avatar);
				}
				console.log(usernames);
				console.log(avatars);
				// Send the startChat event to all the people in the
				// room, along with a list of people that are in it.

				chat.in(data.id).emit('startChat', {
					boolean: true,
					id: data.id,
					users: usernames,
					avatars: avatars
				});
			});
		});

		// Somebody left the chat
		socket.on('disconnect', function() {

			// Notify the other person in the chat room
			// that his partner has left

			socket.broadcast.to(this.room).emit('leave', {
				boolean: true,
				room: this.room,
				user: this.username,
				avatar: this.avatar
			});

			// leave the room
			socket.leave(socket.room);
		});


		// Handle the sending of messages
		socket.on('msg', function(data){

			// When the server receives a message, it sends it to the other person in the room.
			socket.broadcast.to(socket.room).emit('receive', {msg: data.msg, user: data.user, img: data.img});
		});
	});
};

function findClientsSocket(io,roomId, namespace) {
	var res = [],
		ns = io.of(namespace ||"/");    // the default namespace is "/"

	if (ns) {
		for (var id in ns.connected) {
			if(roomId) {
				var index = ns.connected[id].rooms.indexOf(roomId) ;
				if(index !== -1) {
					res.push(ns.connected[id]);
				}
			}
			else {
				res.push(ns.connected[id]);
			}
		}
	}
	return res;
}


