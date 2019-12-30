const mongoose = require('mongoose')
const Schema = mongoose.Schema;
let mnth = [1,2,3,4,5,6,7,8,9,10,11,12], d = new Date()
const coursesSchema = new Schema({
    title:{
        type:String
    },
    img:{
        type:String
    },
    description:{
      type:String
    },
    offerprice:{
        type:Number
    },
    actualprice:{
        type:Number
    },
    members:{
        type:Number,
        default:0
    },
    createdAt:{
        type:String,
        default:`${d.getDate()}/${mnth[d.getMonth()]}/${d.getFullYear()}`
    },
})

module.exports = mongoose.model('Course', coursesSchema)