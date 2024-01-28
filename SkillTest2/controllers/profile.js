const User = require("../models/User");
const fs = require('fs');
const path = require('path');


module.exports.get_profile = (req, res) =>{
    const user = User.findOne({_id :req.query.id}).then((users)=>{
        console.log(req.user);
        res.render('profile',{ user: users, cur_user_id: req.user.id})
    }).catch((err)=>{res.redirect('back')});


}

module.exports.update_profile = (req,res)=>{
    try{

    User.UploadedAvatar(req,res, async function(err){
        if(err){
            console.log("Multer Error", err)

        }
        else{
            const user = await User.findOne({_id: req.body._id});
            if(req.file){
                if(user.avatar){
                    fs.unlinkSync(path.join(__dirname, '..',user.avatar));
                }
            req.body.avatar = User.avatarPath + '/' +req.file.filename; 
            const update = await User.updateOne({_id : req.body._id}, {$set :req.body});
            if(update){
                res.redirect('/');
               }
               else{
                res.redirect('back');
               }
        }
        else{
            res.redirect('back');
        }
    }
    });
}
catch{
    res.redirect('back');
}
  
  
}