const mongoose = require('mongoose');
const { Schema } = mongoose

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max:20,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        max: 50,

    },
    password:{
        type: String,
        required: true,
        min: 5,
    },
    isAvatarImgSet:{
        type:Boolean,
        default: false
    },
    avatarImg:{
        type: String,
        default:""
    }
})
module.exports = mongoose.model("Users", userSchema);