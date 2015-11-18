// vendor libraries
var bcrypt = require('bcrypt-nodejs');
var ejs = require('ejs');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// var Model = require('../models/user-model');
// var config = require('../config');
// var model = require('../models/model-mongodb')(config);
var Model = require('../models/mongo-all-model');

passport.use(new LocalStrategy(function(username, password, done) {
   Model.User.findOne({'username': username}, function(err, user) {
      if(!user) {
         return done(null, false, {message: 'Username not found'});
      } else {
         if(!bcrypt.compareSync(password, user.password)) {
            return done(null, false, {message: 'Invalid password'});
         } else {
            return done(null, user);
         }
      }
   });
   // new Model.User({username: username}).fetch().then(function(data) {
   //    var user = data;
   //    if(user === null) {
   //       return done(null, false, {message: 'Invalid username or password'});
   //    } else {
   //       user = data.toJSON();
   //       if(!bcrypt.compareSync(password, user.password)) {
   //          return done(null, false, {message: 'Invalid username or password'});
   //       } else {
   //          return done(null, user);
   //       }
   //    }
   // });
}));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
   Model.User.findOne({'username': username}, function(err, user) {
      done(err, user);
   });
});

module.exports = passport;