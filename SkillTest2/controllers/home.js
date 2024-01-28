const User = require("../models/User")


module.exports.home = async (req, res)=>{
   
    // res.render('home')

    const users = await User.find();


if(req.isAuthenticated()){
   
    
    User.findOne({_id: req.user.id}).then(doc=>{
       
        if(doc){
            res.render('home', {email: doc.email, name: doc.name, user : users, title: "Home"})
        }
       else{
        res.redirect('/user/signIn')
       }
        
    })
}
else{
    res.redirect("/user/SignIn");
}
}