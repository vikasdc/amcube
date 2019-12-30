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
    gender:{
        type:String
    },
    dob:{
        type:String
    },
    degree:{
        type:String
    },
    address:{
        type:String
    },
    testCity:{
        type:String
    },
    testDate:{
        type:String
    }, 
    testTime:{
        type:String
    },
    testAppliedDate:{
        type:String,
        default:`${d.getDate()}/${mnth[d.getMonth()]}/${d.getFullYear()}`
    },
    paid:{
        type:Boolean,
        default:false
    },
    testId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Test' 
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

module.exports = mongoose.model('TestApplication', applicationSchema)
