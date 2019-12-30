const mongoose = require('mongoose');
let mnth = [1,2,3,4,5,6,7,8,9,10,11,12], d = new Date()
const bugSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    bugmessage:{
        type:String,
        required:true
    },
    createdAt:{
        type:String,
        default:`${d.getDate()}/${mnth[d.getMonth()]}/${d.getFullYear()}`
    },
})

module.exports = mongoose.model('Bug', bugSchema);