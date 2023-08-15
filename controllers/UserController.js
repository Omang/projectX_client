
const expressAsyncHandler = require('express-async-handler');

const User = require('../models/UserModel');

const register = expressAsyncHandler(async(req, res)=>{

    const {mobilenumber, password, role} = req.body;
    console.log(req.body);
    try{
        const finduser = await User.findOne({mobilenumber: mobilenumber});

        if(!finduser){

         const datax = await User.create(req.body);
        res.json({message: 'Registered successful'});

        }else{
            res.json({message: 'User exists'})
        }
      

    }catch(e){

        console.log(e);
        throw new Error(e);
    }

})
const login = expressAsyncHandler(async(req, res)=>{

    const {mobilenumber , password} = req.body;
    console.log(req.body);
    try{

        const passwordok = await User.findOne({mobilenumber: mobilenumber});
        
        if(passwordok && await passwordok.isPasswordMatched(password)){
            
          res.json({
            user_id: passwordok?._id,
            phonenumber: passwordok?.mobilenumber,
            role: passwordok?.role
          })

        }else{
            res.json({message: 'wrong creditials'})
        }

    }catch(e){
        console.log(e);
        throw new Error(e);
    }

});
const verifyuser = expressAsyncHandler(async(req, res)=>{
  //sms api
});
const forgotpassword = expressAsyncHandler(async(req, res)=>{
  //sms api
});
const paymentcheck = expressAsyncHandler(async(req, res)=>{
    const {userid} = req.body;
    try{
        const finduser = await User.findById(userid);
        console.log(finduser);
        if(finduser){

            const payment = finduser.payment.activation;
            if(payment){
                res.json({message: 'activated'});
            }else{
                res.json({message:'unactivated'});
            }

        }else{
            res.json({message: 'User not found'});
        }

    }catch(e){
        console.log(e);
        throw new Error(e);
    }
});
const paymodule = expressAsyncHandler(async(req, res)=>{
     const {amount, duration, fromdate, todate, userid} = req.body;
     try{
        //const duration = todate - fromdate;
        const finduser = await User.findById(userid);
        if(finduser){
          const payment = await User.findByIdAndUpdate(userid,{
            payment:{activation: true, duration: duration, expiry: todate},
            $push:{paymenthistory:{from: fromdate, to: todate, amount: amount }}
          }, {new:true});
          res.json({message:'payment made', item: payment?.payment});
        }else{
          res.json({message: 'User not registered'});
        }
     }catch(e){
        throw new Error(e);
     }
});

const updateprofile = expressAsyncHandler(async(req, res)=>{
    const {standardlevel, userid} =  req.body;
    try{

        const finduser = await User.findById(userid);
         
        if(finduser){

            const updateprofile = await User.findByIdAndUpdate(userid, {
               standardlevel: standardlevel 
            }, {new: true});

            res.json({message:"Standard updated", item: updateprofile?.standardlevel})

        }else{
            res.json({message: "User not found"});
        }

    }catch(e){

        throw new Error(e);
    }
});

const addhistory = expressAsyncHandler(async(question, answer, userid)=>{
    try{
       const additem = await User.findByIdAndUpdate(userid, {
        $push:{searchhistory:{question: question, answer: answer}}
       }, {new: true});
       res.json(additem.searchhistory);

    }catch(e){

        throw new Error(e);

    }
})
 
const userhistory = expressAsyncHandler(async(req, res)=>{
    const {userid} = req.body;
    try{

        const searchhistory = await User.findById(userid);
        res.json(searchhistory.searchhistory);

    }catch(e){

        throw new Error(e);

    }
})

module.exports ={register, login, verifyuser, forgotpassword, paymodule, 
    updateprofile, paymentcheck, userhistory, addhistory};