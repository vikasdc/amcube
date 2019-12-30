const mongoose = require('mongoose')
let mnth = [1,2,3,4,5,6,7,8,9,10,11,12], d = new Date()
const adminSchema = new mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    createdAt:{
        type:String,
        default:`${d.getDate()}/${mnth[d.getMonth()]}/${d.getFullYear()}`
    },
})
module.exports = mongoose.model('Adminuser', adminSchema)