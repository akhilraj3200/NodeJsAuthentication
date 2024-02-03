const User = require("../models/User")


module.exports.home = async (req, res)=>{
   
    // res.render('home')

    const users = await User.find();



if(req.isAuthenticated()){
   

    User.findOne({_id: req.user.id}).then(doc=>{


        if(doc){
            console.log(doc)
            res.render('home', {email: doc.email, name: doc.name, user : users, title: "Home", err: "", msg : "login successfully"})
        }
       else{
        res.render("user_sign_in", {err: "User not Found", msg : "", title: "User | sign in"});
       }
        
    })
}
else{
    res.render("user_sign_in", {err: "Please login with your credentials", msg : "", title: "User | sign in"});
}
}