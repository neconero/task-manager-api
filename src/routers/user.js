const express = require('express')
const routers = new express.Router()
const auth  = require('../middleware/auth')
const User = require('../models/user')

routers.post('/users', async(req, res) =>{
    const user = new User(req.body)

    try{
      await user.save()
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
        res.send({user: user.getPublicProfile(), token})
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

//get a user by any id
routers.get('/users/:id', async(req,res) => {
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send() 
        }
        res.status(200).send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

//update the user
routers.patch('/users/:id', async(req,res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error: "Invalid updates"})
    }
    try{
        //because this function bypasses the schema
        //create a variable
        const user = await User.findById(req.params.id)

        //updating dynamically the property of choice
        updates.forEach((update) => {
            //applying the request to the new user
            user[update] = req.body[update]
        })

        //middleware gets implemented
        await user.save()

        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        return res.status(400).send(e)
    }
    
})

routers.delete('/users/:id', async(req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})


module.exports = routers