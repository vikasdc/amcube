const mongoose = require('mongoose')
const Schema = mongoose.Schema;
let mnth = [1,2,3,4,5,6,7,8,9,10,11,12], d = new Date()
const testSchema = new Schema({
    city:{
        type:String,
        required:true
    },
    testdate:{
        type:String,
        required:true
    },
    time1from:{
        type:String,
    },
    time1to:{
        type:String,
    },
    time2from:{
        type:String,
    },
    time2to:{
        type:String,
    },
    time3from:{
        type:String,
    },
    time3to:{
        type:String,
    },
    createdAt:{
        type:String,
        default:`${d.getDate()}/${mnth[d.getMonth()]}/${d.getFullYear()}`
    },
})

module.exports = mongoose.model('Test', testSchema)