const mongoose = require('mongoose')
let mnth = [1,2,3,4,5,6,7,8,9,10,11,12], d = new Date()
const CertSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    college:String,
    city:String,
    parentphone:Number,
    certification:String,
    createdAt:{
        type:String,
        default:`${d.getDate()}/${mnth[d.getMonth()]}/${d.getFullYear()}`
    }
});
module.exports = mongoose.model('Certification', CertSchema)