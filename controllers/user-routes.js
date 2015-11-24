// vendor library
// var passport = require('passport');
// var bcrypt = require('bcrypt-nodejs');

// custom library
// model
// var Model = require('../models/user-model');
// var model = require('../models/model-mongodb')
// var Model = require('../models/mongo-all-model');

// Firebase Integration
var Firebase = require("firebase");
var ref = new Firebase("https://blistering-heat-6322.firebaseio.com/");


// sign in
// GET
var signIn = function(req, res, next) {
   if(ref.getAuth()) res.redirect('/');
   res.render('signin', {title: 'Sign In to Freemie!'});
};

// sign in
// POST
var signInPost = function(req, res, next) {
   var user = req.body;
   console.log(user);
   ref.authWithPassword({
     email    : user.email,
     password : user.password
   }, function(error, authData) {
      if(error) {
         return res.render('signin', {title: 'Sign In to Freemie!', errorMessage: error.message});
      } else {
         console.log(authData)
         return res.redirect('/');
      }
   });
   // passport.authenticate('local', { successRedirect: '/',
   //                        failureRedirect: '/signin'}, function(err, user, info) {
   //    if(err) {
   //       return res.render('signin', {title: 'Sign In to Freemie!', errorMessage: err.message});
   //    } 

   //    if(!user) {
   //       return res.render('signin', {title: 'Sign In to Freemie!', errorMessage: info.message});
   //    }
   //    return req.logIn(user, function(err) {
   //       if(err) {
   //          return res.render('signin', {title: 'Sign In to Freemie!', errorMessage: err.message});
   //       } else {
   //          return res.redirect('/');
   //       }
   //    });
   // })(req, res, next);
};

// sign up
// GET
var signUp = function(req, res, next) {
   if(ref.getAuth()) {
      res.redirect('/');
   } else {
      res.render('signup', {title: 'Sign Up'});
   }
};

// sign up
// POST
var signUpPost = function(req, res, next) {
   var user = req.body;
   
   if (user.profilepic.match(/\.(jpeg|jpg|gif|png)$/) == null) {
      res.render('signup', {title: 'signup', errorMessage: 'Profile Pic URL not an image.'});
   }

   ref.createUser({
     email       : user.email,
     password    : user.password
   }, function(error, userData) {
     if (error) {
       console.log(error);
       res.render('signup', {title: 'signup', errorMessage: "Email Address Taken"});
     } else {
      console.log("Successfully created user account with uid:", userData.uid);
      console.log(userData);
      var uid = userData.uid;
      new_user = {};
      new_user[uid] = {
                        provider: "password",
                        username: user.username,
                        first_name: user.firstname,
                        last_name: user.lastname,
                        profile_pic: user.profilepic,
                        email: user.email
                     }
      console.log(new_user);
      console.log(userData.provider);
      ref.child("users").push(new_user);
      signInPost(req, res, next);
     }
   });
   

   // // var usernamePromise = new Model.User({username: user.username}).fetch();
   // var usernamePromise = Model.User.findOne({'username': user.username}, function(err, existinguser) {
   //    if (err) {
   //       console.log('Error in SignUp: '+err)
   //    };
   //    if (existinguser) {
   //       console.log('User already exists');
   //       res.render('signup', {title: 'signup', errorMessage: 'username already exists'});
   //    } else {
   //       var password = user.password;
   //       var hash = bcrypt.hashSync(password);

   //       var newUser = new Model.User();
   //       newUser.username = user.username;
   //       newUser.password = hash;
   //       newUser.first_name = user.firstname;
   //       newUser.last_name = user.lastname; 
   //       newUser.profile_pic = user.profilepic; 
   //       newUser.email = user.email;

   //       newUser.save(function(err) {
   //          if (err) {
   //             console.log('Error in Saving User: ' + err);
   //             throw err;
   //          }
   //          signInPost(req, res, next);
   //       });
   //    };
   // });

   
   
      // return usernamePromise.then(function(model) {
      //    if(model) {
      //       res.render('signup', {title: 'signup', errorMessage: 'username already exists'});
      //    } else {
      //       //****************************************************//
      //       // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
      //       //****************************************************//
      //       var password = user.password;
      //       var hash = bcrypt.hashSync(password);
      //       console.log(hash);

      //       model.create({'username': user.username, 'password': hash, 'first_name': user.firstname, 'last_name': user.lastname, 'profile_pic': user.profilepic, 'email': user.email}, function(err, savedData) {
      //          if (err) return handleRpcError(err, res);
      //          signInPost(req, res, next);
      //       })

      //       // var signUpUser = new Model.User({username: user.username, password: hash, first_name: user.firstname, last_name: user.lastname, profile_pic: user.profilepic, email: user.email});

      //       // signUpUser.save().then(function(model) {
      //       //    // sign in the newly registered user
      //       //    signInPost(req, res, next);
      //       // });	
      //    };
      // });
   // };
};

// sign out
var signOut = function(req, res, next) {
   ref.unauth();
   res.redirect('/signin');
};

// export functions
module.exports.signIn = signIn;
module.exports.signInPost = signInPost;
module.exports.signUp = signUp;
module.exports.signUpPost = signUpPost;
module.exports.signOut = signOut;



