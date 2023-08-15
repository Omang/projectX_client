
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    mobilenumber:{type:Number, required: true, unique:true},
    password:{type:String},
    role:{type:String},
    standardlevel:{type:String},
    payment:{activation:{type:Boolean, default: false}, duration:Number, expiry: Date },
    paymenthistory:[{
        from: {type:Date},
        to: {type:Date},
        amount:{type:Number}
    }],
    searchhistory:[
        {
            question:{type:String},
            answer:  {type: String}
        }
    ]
}, {timestamps: true});

UserSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password, salt);
    next();
})
UserSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compareSync(enteredPassword, this.password);
}


module.exports = mongoose.model('User', UserSchema);