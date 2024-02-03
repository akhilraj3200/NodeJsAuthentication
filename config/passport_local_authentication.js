// var express = require('express');
// // const passport = require('passport');
// var crypto = require('crypto');
// const LocalStrategy = require('passport-local');
// const User = require('../models/User');

// //authentication using passport
// function initialize(passport, email, password){
// console.log("something");
// passport.use(new LocalStrategy(function verify(email, password, cb) {
//     console.log("working");
//     User.get('SELECT * FROM users WHERE email = ?', [ email ], function(err, row) {
//       if (err) { return cb(err); }
//       if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }
  
//       crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
//         if (err) { return cb(err); }
//         if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
//           return cb(null, false, { message: 'Incorrect username or password.' });
//         }
//         return cb(null, row);
//       });
//     });
//   }));

//   passport.serializeUser(function(user, cb) {
//     process.nextTick(function() {
//       cb(null, { id: user.id, username: user.username });
//     });
//   });
  
//   passport.deserializeUser(function(user, cb) {
//     process.nextTick(function() {
//       return cb(null, user);
//     });
//   });
// }

// module.exports =  initialize;



// var passport = require('passport');// This is how you initialize the local strategy module      /////////////////////////second version
// var LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/User');



// passport.use(new LocalStrategy(function(username, password, done) {
//     User.findOne({
//         username: username
//     }, function(err, user) {
//         // This is how you handle error
//         if (err) return done(err);        // When user is not found
//         if (!user) return done(null, false);        // When password is not correct
//         if (!user.authenticate(password)) return done(null, false);        // When all things are good, we return the user
//         return done(null, user);
//      });
// }));


// passport.serializeUser(function(user, done) {
//     done(null, user.id);
// });passport.deserializeUser(function(id, done) {
//     User.findOne({
//         _id: id
//     }, '-password -salt', function(err, user) {
//         done(err, user);
//     });
// });


const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserByID){
    const authenticator = async (email, password, done) => {
        const user = getUserByEmail(email);
        if (!user) { // with this email no user exists
             return done(null, false); 
        }
        try {
            console.log(password)
            console.log(user.password)
            if(await bcrypt.compare(password, user.password)) {// user is valid
                return done(null, user);
            }
            else{// passwords didn't match
                return done(null, false);
            }
        } catch (error) {
            return done(error)
        }
    }
    passport.use(new LocalStrategy({usernameField: 'email'}, authenticator ));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
            done(null, getUserByID(id))
      });
}

module.exports = initialize;