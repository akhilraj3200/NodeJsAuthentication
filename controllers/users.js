const User = require('../models/User')
const bcrypt = require('bcrypt')
var Email = require('../config/emailsender');
const crypto = require('crypto');

module.exports.user_sign_in_controller = (req, res)=>{
    if(req.isAuthenticated()){
        res.redirect('/')
   
    }
    else{
        res.render('user_sign_in', {title:"User | sign in" , err: "", msg : ""});
        
    }
}

module.exports.user_sign_up_controller = (req, res) =>{
    if(req.isAuthenticated()){
        res.redirect('/')
    }
    else{
    res.render('user_sign_up', {title:"User|Sign Up", err: "", msg : ""});
    }
}

//sign in 

module.exports.createSession = (req, res) =>{
    //to do
    User.findOne({email: req.body.email}).then(result=>{
        if(result){
            bcrypt.compare(req.body.password, result.password, async(err, password_check) => {
                              if (err) {
                                return res.redirect('back');
                                console.log("some error")
                              } else {

                if(password_check){
              
                return res.redirect('/');
                }
                else{
                    return res.redirect('/');
                }
                }
            })}
        
        else{
            return res.redirect('back');
        }  

}
)
}


module.exports.create = (req, res)=>{
    if(req.body.password != req.body.confirm_password){
        return res.render('user_sign_up', {title:"User|Sign Up" , err: "Password mismatch error", msg : ""})
        // return res.redirect('back');
    }
    User.findOne({email: req.body.email}).then((result)=>{
        if(result){
        // return res.redirect('back');
        return res.render('user_sign_up', {title:"User|Sign Up" , err: "Email already exists error", msg : ""})
        }
        else{
            User.create(req.body).then((user)=>{  
                res.render('user_sign_in', {title:"User | sign in" , err: "", msg : ""});
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
            return res.render('user_sign_up', {title:"User|Sign Up" , err: "Password mismatch error", msg : ""})
            // return res.redirect('back');
        }
        User.findOne({email: req.body.email}).then(async(result)=>{
            if(result){
            // return res.redirect('back');
            return res.render('user_sign_up', {title:"User|Sign Up" , err: "Email already exists error", msg : ""})
            }
            else{
                if(req.body.password.length <8){
                    return res.render('user_sign_up', {title:"User|Sign Up" , err: "Minimum 8 characters needed in password", msg : ""})
                }
                const hashpassword = await bcrypt.hash(req.body.password, 10)
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashpassword
                }).catch((err)=>res.render('user_sign_up', {title:"User|Sign Up" , err: "Unknown Error, Couldn't Sign Up", msg : ""}))
                return res.render('user_sign_in', {title:"User | sign in" , err:"", msg : "Account Created Please Login"});
            }
        }
    )
        
        
    } 
    catch{
        return res.render('user_sign_up', {title:"User|Sign Up" , err: "Unknown Error, Couldn't Sign Up",msg : ""})
    }
}

module.exports.signout = (req, res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.render('user_sign_in', {title:"User | sign in" , err:"", msg: "Successfully signed out"});
      });
    
}

// module.exports.forget_password = (req, res)=>{
//     res.render('forgetpassword', {title:"User | Forget Password" , err:""});
// }

// module.exports.change_password = (req, res)=>{
//     User.findOne({email: req.body.email}).then(async(result)=>{
//         if(result){
//             const storedHashedPassword = result.password;

//             const plainPasswordToCheck = req.body.old_password;
            
//             bcrypt.compare(plainPasswordToCheck, storedHashedPassword, async(err, password_check) => {
//               if (err) {
//                 return res.render('forgetpassword', {title : "User | Forget Password", err :"Some technical error"} );
//               } else {
//                 if (password_check) {
//                   if (req.body.new_password == req.body.confirm_password){
//                     newHashedPassword = await bcrypt.hash(req.body.new_password, 10)
//                     if(req.body.new_password.length <8){
//                         return res.render('forgetpassword', {title:"User | Forget Password" , err: "Minimum 8 characters needed in password"})
//                     }
//                     await User.updateOne({email: req.body.email}, {$set :{"password": newHashedPassword}})
//                     return res.redirect('/user/signIn')

//                   }
//                   else{
//                     return res.render('forgetpassword', {title: "User | Forget Password", err : "Confirm password is different to changed password"} );
//                   }

//                 } else {
//                   return res.render('forgetpassword', {title: "User | Forget Password", err:"Password incorrect please check"} );
//                 }
//               }
//             });
//         }
//         else{
//             return res.render('forgetpassword', {title : "User | Forget Password", err : "User not found"} );
//         }
//     }
// )

// }


module.exports.forget_password = (req, res)=>{
    res.render('forgetpassword', {title:"User | Forget Password" , err:"", msg : ""});
}

module.exports.change_password = (req, res)=>{
    User.findOne({email: req.body.email}).then(async(result)=>{
        if(result){
            const storedHashedPassword = result.password;

            const plainPasswordToCheck = req.body.old_password;
            
            bcrypt.compare(plainPasswordToCheck, storedHashedPassword, async(err, password_check) => {
              if (err) {
                return res.render('forgetpassword', {title : "User | Forget Password", err :"Some technical error", msg : ""} );
              } else {
                if (password_check) {
                  if (req.body.new_password == req.body.confirm_password){
                    newHashedPassword = await bcrypt.hash(req.body.new_password, 10)
                    if(req.body.new_password.length <8){
                        return res.render('forgetpassword', {title:"User | Forget Password" , err: "Minimum 8 characters needed in password", msg : ""})
                    }
                    await User.updateOne({email: req.body.email}, {$set :{"password": newHashedPassword}})
                    return res.render('user_sign_in', {title:"User | sign in" , err: "", msg : ""});

                  }
                  else{
                    return res.render('forgetpassword', {title: "User | Forget Password", err : "Confirm password is different to changed password", msg : ""} );
                  }

                } else {
                  return res.render('forgetpassword', {title: "User | Forget Password", err:"Password incorrect please check", msg : ""} );
                }
              }
            });
        }
        else{
            return res.render('forgetpassword', {title : "User | Forget Password", err : "User not found", msg : ""} );
        }
    }
)

}

// module.exports.test_email = (req, res)=>{
//     const emails = ['akhilraj3200@gmail.com', 'akhilraj.s@collabll.com'];
//     Email(emails, "Subject", "Text")
// }


module.exports.send_password_reset_link = async(req, res)=>{
    try{
    const email = [req.body.email] 
    const Subject = "Authentication App Password Reset Link"
    const token = crypto.randomBytes(32).toString('hex');
    const expiration_data = Date.now() + 3600000;
    const domainWithProtocol = `${req.protocol}://${req.headers.host}/user/reset_password?token_expiration_time=${expiration_data}&email=${email}&token=${token}`;
    
    const product = await User.findOneAndUpdate({email: req.body.email},{$set :{password_reset_token: token, token_expiration_time: expiration_data}});
    const body = "Link to Reset Password : "+ domainWithProtocol;
    const email_status = Email(email, Subject, body)
    return res.render('user_sign_in', {title:"User | sign in" , err: "", msg : "Password reset link send successfully"});
    }
    catch(error){
        // console.log(error);
        return res.render('forgetpassword', {title : "User | Forget Password", err :"Some technical error", msg : ""} );
    }
    


}

module.exports.reset_password = async(req, res)=>{
    const email = req.query.email
    const token = req.query.token
    const token_expiration_time = req.query.token_expiration_time
    User.findOne({email: email}).then(async(result)=>{
        if(result){

            if (result.password_reset_token == token & result.token_expiration_time.getTime() >= Date.now()) {

                return res.render('resetpassword',  {title : "User | Change Password", err :"", email : result.email, msg : ""});
            }
            else{
                return res.render('forgetpassword', {title : "User | Forget Password", err :"Token Expired", msg : ""} );
            }


  
        }
        else{
            return res.render('forgetpassword', {title : "User | Forget Password", err :"User not Found", msg : ""} );
        }
    }
    )

}

module.exports.change_password_link = (req, res)=>{
    if(req.params.email){
    User.findOne({email: req.params.email}).then(async(result)=>{
        if(result){
                  if (req.body.new_password == req.body.confirm_password){
                    newHashedPassword = await bcrypt.hash(req.body.new_password, 10)
                    if(req.body.new_password.length <8){
                        return res.render('resetpassword', {title:"User | Chanage Password" , err: "Minimum 8 characters needed in password",email : result.email, msg : ""})
                    }
                    await User.findOneAndUpdate({email: req.params.email}, {$set :{"password": newHashedPassword}})
                    return res.render('user_sign_in', {title:"User | sign in" , err: "", msg : "Password Updated Successfully"});

                  }
                  else{
                    return res.render('resetpassword', {title: "User | Change Password", err : "Confirm password is different to changed password",email : result.email, msg : ""} );
                  }

                
              
                }  else{
                    return res.render('resetpassword', {title : "User | Change Password", err : "User not found", email : result.email, msg : ""} );
                }});
            }

        }
    

    



