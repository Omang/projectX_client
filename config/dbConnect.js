const {default: mongoose} = require('mongoose');
const asyncHandler = require('express-async-handler');

const dbConnect = asyncHandler(async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODBC);
       console.log('database connected successfull'); 
    } catch (err) {
      console.log(err);
    }
})

module.exports = dbConnect;