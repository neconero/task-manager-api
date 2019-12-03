const express = require('express')
const routers = new express.Router()
const Task = require('../models/task')

routers.post('/tasks', async(req, res) => {
    const task = new Task(req.body)

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }

    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
})


routers.patch('/tasks/:id', async(req, res) => {
    const updates = Object.keys(req.body)//convert object
    const allowedUpdates = ['description', 'completed']//what 
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update) )

    if(!isValidOperation){
        return res.status(400).send({error: "Invalid updates!"})
    }
    try{
        const task = await Task.findByIdAndUpdate(req.params.id)

        updates.forEach((update) => task[update] = req.body[update])

        task.save()
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, 
        //     {new: true, runValidators: true})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        return res.status(400).send(e)
    }
})


routers.delete('/tasks/:id', async(req,res) => {
    try{
        const task = await Task.findByIdAndDelete(req.param.id)
        if(!task){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

routers.get('/tasks', async(req, res) => {
    try{
        const task = await Task.find({})
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
    // Task.find({}).then((task) => {
    //     res.send(task)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

routers.get('/tasks/:id', async(req, res) => {
    const _id = req.params.id

    try{
        const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
    // Task.findById(_id).then((task) => {
    //     if(!task){
    //         return res.status(404).send()
    //     }
    //     res.status(202).send(task)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

module.exports = routers