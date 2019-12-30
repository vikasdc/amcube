const mongoose = require('mongoose')
let mnth = [1,2,3,4,5,6,7,8,9,10,11,12], d = new Date()
const applicationSchema = new mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String
    },
    contact:{
        type:Number
    },
    jobTitle:{
        type:String
    },
    jobCompany:{
        type:String
    },
    salary:{
        type:Number
    },
    city:{
        type:String
    },
    jobAppliedDate:{
        type:String,
        default:`${d.getDate()}/${mnth[d.getMonth()]}/${d.getFullYear()}`
    },
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job'
    },
    profileId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Profile'
    },
    createdAt:{
        type:String,
        default:`${d.getDate()}/${mnth[d.getMonth()]}/${d.getFullYear()}`
    },
})

module.exports = mongoose.model('JobApplication', applicationSchema)