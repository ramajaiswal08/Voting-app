const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age : {
        type : Number,
        required: true
    },
    email : {
        type : String, 
        required: true,
        lowercase: true,
        trim: true,
        unique:true
    },
    mobile:{
        type : String,
        required: true,
        unique:true

    },
    address: {
        type: String,
        required:true
    },
    aadharCardNumber:{
        type: Number,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum : ['voter' , 'admin'],
        default: 'voter'
    },
    isVoted:{
        type: Boolean,
        default: false
    }


});
UserSchema.pre('save',async function(next){
    const person = this;

    //Hash this pswd olny if it has been modified or new
    if(!person.isModified('password')) return next();
    try{

        //hash paswd generation
        const salt = await bcrypt.genSalt(10);
        //Has pswd
        const hashedPassword = await bcrypt.hash(person.password,salt);
        person.password = hashedPassword;     
        next();
    }catch(err){
        return next(err);
    }

})

UserSchema.methods.comparePassword = async function(candidatePassword)  {
    try{
      const isMatch = await bcrypt.compare(candidatePassword,this.password);
      return isMatch;
    }catch(err){
      throw err;
    }
}


const User = mongoose.model('User' , UserSchema);
module.exports = User;