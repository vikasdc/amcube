const mongoose = require('mongoose')
const Schema = mongoose.Schema;
let mnth = [1,2,3,4,5,6,7,8,9,10,11,12], d = new Date()
const userSchema = new Schema({
    profileImg:{
        type:String,
        default:'assets/img/face1240.png'
    },
    username:{
        type:String,
    },
    email: {
        type:String,
    },
    contact:{
        type:Number,
        default:undefined
    },
    password:{
        type:String,
    },
    resetToken:{
        type:String
    },
    tokenExpiry:{
        type:Date
    },
    googleId:{
        type:String
    },
    twitterId:{
        type:String
    },
    profile:{
        type:Schema.Types.ObjectId,
        ref:'Profile'
    },
    createdAt:{
        type:String,
        default:`${d.getDate()}/${mnth[d.getMonth()]}/${d.getFullYear()}`
    }
})

module.exports = mongoose.model('User', userSchema)