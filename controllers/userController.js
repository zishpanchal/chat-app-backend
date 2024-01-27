const User = require("../model/userModel");
const bcrypt = require("bcrypt")

//register
module.exports.register = async (req, res, next) =>{
    try{
        const {username, email, password} = req.body;
        const userCheck = await User.findOne({username});
    if(userCheck){
        return res.json({msg: "Username already used", status: false});
    }
    const emailCheck = await User.findOne({email});
    if(emailCheck){
        return res.json({msg: "Email already used", status: false});
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        email,
        username,
        password: hashPassword
    });
    delete user.password;
    return res.json({status: true, user})
    }
    catch(e){
        console.log(e)
        next(e);
    }
}

//login
module.exports.login = async (req, res, next) =>{
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
    if(!user){
        return res.json({msg: "Incorrect username or password", status: false});
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.json({msg: "Incorrect username or password", status: false});
    }
    delete user.password;
    return res.json({status: true, user});
    }
    catch(e){
        console.log(e)
        next(e);
    }
}

//setAvatar
module.exports.setAvatar = async (req, res, next) =>{
    try{
        const userId = req.params.id;
        const avatarImg = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImgSet:true,
            avatarImg,
        }, { new: true });
        return res.json({
            isSet: userData.isAvatarImgSet,
            image:userData.avatarImg
        });
    }catch(e){
        next(e);
    }
}

//getallusers
module.exports.getAllUsers = async (req, res, next) =>{
    try{
        const users = await User.find({_id: {$ne: req.params.id}}).select([
            "email",
            "username",
            "avatarImg",
            "_id"
        ])
        return res.json(users); 
    }catch(e){
        next(e);
    }
}