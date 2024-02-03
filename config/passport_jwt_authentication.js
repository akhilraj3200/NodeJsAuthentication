const passport = require('passport');
const User = require('../models/User')
var JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
 
    User.findOne({_id: jwt_payload._id}).then((user)=>{
        if(user){
     
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    }).catch((err)=>{
        return done(err, false);
    })
}));

module.exports = passport;

