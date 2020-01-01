const express = require('express')
const routers = new express.Router()
const auth  = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const {sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')

routers.post('/users', async(req, res) =>{
    const user = new User(req.body)

    try{
      await user.save()
      //welcome email after user is saved
      sendWelcomeEmail(user.email, user.name)
      //generate token
      const token = await user.generateAuthToken()
      res.status(201).send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
    
})

routers.post('/users/login', async(req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()//working with an instance
        //sending response
        res.send({user, token})
    }catch(e){
        res.status(400).send()
    }
})

//to read user data and also target by ID
routers.get('/users/me', auth, async(req,res) => {
    res.send(req.user)
})

//logout
routers.post('/users/logout', auth, async(req, res) =>{
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send()
    }
})

//logout all session
routers.post('/users/logoutAll', auth, async(req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})



//update the user
routers.patch('/users/me', auth,  async(req,res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error: "Invalid updates"})
    }
    try{
        
        

        //updating dynamically the property of choice
        updates.forEach((update) => {
            //applying the request to the new user
            req.user[update] = req.body[update]
        })

        //middleware gets implemented
        await req.user.save()

        
        res.send(req.user)
    }catch(e){
        return res.status(400).send(e)
    }
    
})

//delete without access to the id
routers.delete('/users/me', auth, async(req, res) => {
    try{
        await req.user.remove()
        sendCancellationEmail(email, name)
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

const upload = multer({
    limits:{
        fileSize : 1000000
        },
    fileFilter(req, file, cb){
            if(!file.originalname.match(/\.(png|jpeg|jpg)$/)){
                return cb(new Error('Please upload either jpeg, jpg or png'))
            }
            cb(undefined, true)
    } 
})

//upload image to user profile
routers.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    //accessing the binary data(image)
    const buffer = await sharp(req.file.buffer).resize(330, 350).png().toBuffer()
    
    req.user.avatar = buffer

    await req.user.save() //updated model with profile picture
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

//delete image
routers.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined

    await req.user.save()
    res.send()
})

//get image by user id
routers.get('/users/:id/avatar', auth, async(req, res) => {
    
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
        throw new Error()
    }

    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
}catch(e){
    res.status(404).send()
    }
    
})

module.exports = routers