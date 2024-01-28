const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports.user_sign_in_controller = (req, res)=>{
    if(req.isAuthenticated()){
        res.redirect('/')
   
    }
    else{
        res.render('user_sign_in', {title:"User | sign in" });
        
    }
}

module.exports.user_sign_up_controller = (req, res) =>{
    if(req.isAuthenticated()){
        res.redirect('/')
    }
    else{
    res.render('user_sign_up', {title:"User|Sign Up", err: ""});
    }
}

//sign in 

module.exports.createSession = (req, res) =>{
    //to do
    User.findOne({email: req.body.email}).then(result=>{
        if(result){
            if(result.password == req.body.password){
                res.cookie('user_id',result.id)
                req.flash('success', 'User login Successfully');
                console.log(res.locals.flash)
                console.log(req.flash)
                return res.redirect('/');
            }
            else{
                return res.redirect('back');
            }  

        }
        else{
            return res.redirect('back');
        }
    })
}


module.exports.create = (req, res)=>{
    if(req.body.password != req.body.confirm_password){
        return res.render('user_sign_up', {title:"User|Sign Up" , err: "Password mismatch error"})
        // return res.redirect('back');
    }
    User.findOne({email: req.body.email}).then((result)=>{
        if(result){
        // return res.redirect('back');
        return res.render('user_sign_up', {title:"User|Sign Up" , err: "Email already exists error"})
        }
        else{
            User.create(req.body).then((user)=>{  
                res.redirect('/user/signIn');
            }).catch((err)=>res.redirect('back'));
        }
    }
)}

// module.exports.create = async (req, res) => {
//     try {
        
//         const hashpassword = await bcrypt.hash(req.body.password, 10)
//         User.create({
//             name: req.body.name,
//             email: req.body.email,
//             password: hashpassword
//         })
//         return res.redirect('/user/signIn');
//     } catch (error) {
//         console.log(error)
//         return res.redirect('back')
//     }
// }

module.exports.create = async (req, res) => {
    try {

        if(req.body.password != req.body.confirm_password){
            return res.render('user_sign_up', {title:"User|Sign Up" , err: "Password mismatch error"})
            // return res.redirect('back');
        }
        User.findOne({email: req.body.email}).then(async(result)=>{
            if(result){
            // return res.redirect('back');
            return res.render('user_sign_up', {title:"User|Sign Up" , err: "Email already exists error"})
            }
            else{
                if(req.body.password.length <8){
                    return res.render('user_sign_up', {title:"User|Sign Up" , err: "Minimum 8 characters needed in password"})
                }
                const hashpassword = await bcrypt.hash(req.body.password, 10)
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashpassword
                }).catch((err)=>res.redirect('back'))
                return res.redirect('/user/signIn');
            }
        }
    )
        
        
    } 
    catch{
        return res.redirect('back');
    }
}

module.exports.signout = (req, res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/user/signIn');
      });
    
}

module.exports.forget_password = (req, res)=>{
    res.render('forgetpassword', {title:"User | Forget Password" , err:""});
}

module.exports.change_password = (req, res)=>{
    User.findOne({email: req.body.email}).then(async(result)=>{
        if(result){
            const storedHashedPassword = result.password;

            const plainPasswordToCheck = req.body.old_password;
            
            bcrypt.compare(plainPasswordToCheck, storedHashedPassword, async(err, password_check) => {
              if (err) {
                return res.render('forgetpassword', {title : "User | Forget Password", err :"Some technical error"} );
              } else {
                if (password_check) {
                  if (req.body.new_password == req.body.confirm_password){
                    newHashedPassword = await bcrypt.hash(req.body.new_password, 10)
                    if(req.body.new_password.length <8){
                        return res.render('forgetpassword', {title:"User | Forget Password" , err: "Minimum 8 characters needed in password"})
                    }
                    await User.updateOne({email: req.body.email}, {$set :{"password": newHashedPassword}})
                    return res.redirect('/user/signIn')

                  }
                  else{
                    return res.render('forgetpassword', {title: "User | Forget Password", err : "Confirm password is different to changed password"} );
                  }

                } else {
                  return res.render('forgetpassword', {title: "User | Forget Password", err:"Password incorrect please check"} );
                }
              }
            });
        }
        else{
            return res.render('forgetpassword', {title : "User | Forget Password", err : "User not found"} );
        }
    }
)

}


