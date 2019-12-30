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
    courseName:{
        type:String
    },
    coursePrice:{
        type:Number
    },
    courseEnrollDate:{
        type:String,
        default:`${d.getDate()}/${mnth[d.getMonth()]}/${d.getFullYear()}`
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    },
    paid:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:String,
        default:`${d.getDate()}/${mnth[d.getMonth()]}/${d.getFullYear()}`
    },

})

module.exports = mongoose.model('CourseApplication', applicationSchema)