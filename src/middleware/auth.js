const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = async(req, res, next) => {
    try{
        //get the value of token in postman
        const token = req.header('Authorization').replace('Bearer ', '')
        //verify if the provided token exist
        const decoded = jwt.verify(token, 'edondeyred')
        //find user
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        //user no exist
        if(!user){
            throw new Error
        }
        req.token = token
        req.user = user
        next()
    }catch(e){
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = auth