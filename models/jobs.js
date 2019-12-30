const mongoose = require('mongoose')
const Schema = mongoose.Schema;
let mnth = [1,2,3,4,5,6,7,8,9,10,11,12], d = new Date()
const jobSchema = new Schema({
   title:{
        type:String,
        required:true
   },
   company:{
       type:String,
       required:true
   },
   img:{
       type:String,
       required:true
   },
   city:{
       type:String,
       required:true
   },
   salary:{
       type:String,
       required:true
   },
   lastdate:{
       type:String,
       required:true
   },
   createdAt:{
    type:String,
    default:`${d.getDate()}/${mnth[d.getMonth()]}/${d.getFullYear()}`
},
})

module.exports = mongoose.model('Job', jobSchema)