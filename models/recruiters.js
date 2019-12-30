const mongoose = require('mongoose')
const Schema = mongoose.Schema
let mnth = [1,2,3,4,5,6,7,8,9,10,11,12], d = new Date()
const recruiterSchema = new Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
       type:Number
    },
    jobtitle:String,
    company:String,
    createdAt:{
        type:String,
        default:`${d.getDate()}/${mnth[d.getMonth()]}/${d.getFullYear()}`
    }
})

module.exports = mongoose.model('Recruiter', recruiterSchema)