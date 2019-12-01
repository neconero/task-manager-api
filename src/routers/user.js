const express = require('express')
const routers = new express.Router()
const User = require('../models/user')

routers.post('/users', async(req, res) =>{
    const user = new User(req.body)

    try{
      await user.save()
      res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     //catches error and also show us the http status
    //     res.status(400).send(error)
    // })
    
})

//to read user data and also target by ID
routers.get('/users', async(req,res) => {
    try{
        const user = await User.find({})
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
    // User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
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
    // User.findById(_id).then((user) => {
    //     if(!user){
    //        return res.status(404).send()
    //     }
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

//update the user
routers.patch('/users/:id', async(req,res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email', 'age']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error: "Invalid updates"})
    }
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, 
            {new: true, runValidators: true})
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