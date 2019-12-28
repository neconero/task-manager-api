const express = require('express')
const routers = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')
const multer = require('multer')

routers.post('/tasks', auth, async(req, res) => {
    // const task = new Task(req.body)

    const task = new Task({
        ...req.body,
        owner:req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})


routers.patch('/tasks/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)//convert object
    const allowedUpdates = ['description', 'completed']//what 
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update) )

    if(!isValidOperation){
        return res.status(400).send({error: "Invalid updates!"})
    }
    try{
        const task = await Task.findOne({_id:req.params.id, owner: req.user._id})

        updates.forEach((update) => task[update] = req.body[update])

        if(!task){
            return res.status(404).send()
        }

        await task.save()
        
        
        res.send(task)
    }catch(e){
        return res.status(400).send(e)
    }
})


routers.delete('/tasks/:id', auth, async(req,res) => {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//Get tasks?completed = true
//Get tasks?limit=x&skip=y
routers.get('/tasks',auth, async(req, res) => {
    const match = {}
    //sort
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(":")
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
    
})

routers.get('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id

    try{
        
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
    
})


const upload = multer({
    dest : 'avatars'
})

routers.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    res.send()
})
module.exports = routers