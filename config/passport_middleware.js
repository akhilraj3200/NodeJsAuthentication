
const User = require('../models/User')
const bcrypt = require('bcrypt')
passport =  require('passport')
LocalStrategy = require('passport-local').Strategy;


pasport_login = (req, res, next) =>{
    console.log("it is working properly")
    //to do
    User.findOne({email: req.body.email}).then(async(result)=>{
        if(result){
            const match = await bcrypt.compare(req.body.password, result.password);

            if(!match){
                res.cookie('user_id',result.id)
                req.flash('success', 'User login Successfully');
                return next(null, false);
            } 
        }
        else{
            return next(null, false);
        }
        return next(null, result);
    }).catch((err)=>{return next(err);})

    
}


passport.use(new LocalStrategy(pasport_login));


