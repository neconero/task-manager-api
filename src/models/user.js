const validator = require('validator')
const mongoose = require('mongoose')
const User = mongoose.model('User', {
    name:{
        type: String,
        required: true
    },

    email:{
        type: String,
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
    }
})

module.exports = User