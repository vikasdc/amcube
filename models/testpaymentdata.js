const mongoose = require('mongoose')
let mnth = [1,2,3,4,5,6,7,8,9,10,11,12], d = new Date()
const paymentSchema = new mongoose.Schema({
    payment_id:{
        type:String
    },
    status:{
        type:String
    },
    amount:{
        type:Number
    },
    buyer_email:{
        type:String
    },
    buyer_name:{
        type:String
    },
    buyer_phone:{
        type:Number
    },
    payment_request_id:{
        type:String
    },
    mac:{
        type:String
    },
    testDate:String,
    testTime:String,
    testCity:String,
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    createdAt:{
        type:String,
        default:`${d.getDate()}/${mnth[d.getMonth()]}/${d.getFullYear()}`
    }
})

module.exports = mongoose.model('TestPaymentdata', paymentSchema)