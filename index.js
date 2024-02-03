const express = require('express');
const SaasMiddleware = require('node-sass-middleware')
const db = require('./config/mongoose')
const User = require('./models/User')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const login = require('./config/passport_middleware');
const MongoStore = require('connect-mongo');
const path = require('path');

const bcrypt = require('bcrypt')

var SQLiteStore = require('connect-sqlite3')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;






const app = express();


const port = 10001;
const expressLayouts = require('express-ejs-layouts');



app.use(SaasMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true,
    outputStyle: 'extended',
    prefix: '/css'
}));


app.use(express.static('assets'));
app.use('/',express.static(path.join(__dirname, "/assets")));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: 'mongodb+srv://akhilraj3200:3cjvztm1c8y00oGX@cluster0.k7vm8mj.mongodb.net/',
    dbName: 'codial',
    autoRemove: 'interval',
    autoRemoveInterval: 10
  })}));
app.use(passport.authenticate('session'));
app.use(expressLayouts); 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

const data = require('./config/passport_middleware').pasport_login;
const PassportJWTStrategy = require("./config/passport_jwt_authentication")
const PassportGoogle = require("./config/googleoauth")
var strategy = new LocalStrategy({ usernameField: 'email' },(email, password, done) =>{
    //to do
    User.findOne({email: email}).then(async(user)=>{
        if(user){
          console.log("user")
            const match = await bcrypt.compare(password, user.password);
            console.log("pasword")

            if(!match){
                return done(null, false);
            } 
            return done(null, user);
        }
        else{
            return done(null, false);
        }
       
    }).catch((err)=>{return done(err);})

    
})
passport.use(strategy);



passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, email: user.email });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
     
      return cb(null, user);
    });
  });
  passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
     
        return next();
    }
    return res.redirect('/user/signIn')
  }
  passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
        // res.cookie('user_id',result.id)
        // req.flash('success', 'User login Successfully');
        // console.log(res.locals.flash)
        // console.log(req.flash)
    }
  }

app.set('views', './views');
app.set('view engine', 'ejs');
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);








app.listen(port, (err)=>{
    if(err){
        console.log("error in starting port: ", port);
    }
    console.log("server started at port: ", port);
})

app.use('/', require('./router/index'));