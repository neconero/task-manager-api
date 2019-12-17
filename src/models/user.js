const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//enables us to use the middleware
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.includes('password')){
                throw new Error('Please password contains password')
            }
        }
    },
    age:{
        type: Number,
        validate(value){
            if(value < 0){
                throw new Error('Number must be a positive number')
            }
        }
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
})
//generating token
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = await jwt.sign({_id : user._id.toString() }, 'edondeyred')

    user.tokens = user.tokens.concat({token})
    //save token to db
    await user.save()
    return token
}

userSchema.methods.getPublicProfile() = function() {
    const user = this

    const userObject = user.toObject()

    delete userObject.password

    delete userObject.tokens

    return userObject
}


userSchema.statics.findByCredentials = async(email, password) => {
    //verify email
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login')
    }
    
    //verify if password exist
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    //return user if found
    return user
}

//condition for user before being saved
userSchema.pre('save', async function (next){
    const user = this

    //using bcrypt when you creating or modifying password
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
const User = mongoose.model('User', userSchema)

module.exports = User