// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
const {MongoClient, ObjectID} = require('mongodb')

const id = new ObjectID
console.log(id.toHexString().length)
console.log(id.getTimestamp())

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, {useNewUrlParser: true , useUnifiedTopology: true }, (error, client) => {
    if(error){
        return console.log('Unable to connect to database:')
    }
    const db = client.db(databaseName)

    db.collection('tasks').deleteOne({
        name: 'POV'
        //_id : new ObjectID("5da5a7105cd508019c0543f1")
    }).then((result) =>{
    console.log(result)
    }).catch((error) =>{
        console.log(error)
    })

    // db.collection('users').insertOne({
    //     name: 'Kayode',
    //     age: 26
    // }, (error, result) => {
    //     if(error){
    //         return console.log('No user inserted')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Chinaza',
    //         age:23
    //     },
    //     {
    //         name: 'Chidera',
    //         age: 28
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log('Users were not inserted')
    //     }
    //     console.log(result.ops)
    // })
    // db.collection('tasks').insertMany([
    //     {
    //         name: 'POV',
    //         completed: true
    //     },
    //     {
    //         name: 'Anal',
    //         completed: true 
    //     },
    //     {
    //         name: 'Fisting',
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log('E no enter')
    //     }
    //     console.log(result.ops)
    // })
    // db.collection('tasks').findOne({_id: new ObjectID("5da5a7105cd508019c0543f1")}, 
    // (error, result) => {
    //     if(error){
    //         return console.log('E no enter')
    //     }
    //     console.log(result)
    // })

    // db.collection('tasks').find({completed: false}).toArray((error, user) => {
    //     if(error){
    //         console.log('I no fit find am')
    //     }
    //     console.log(user)
    // })
    
    
})