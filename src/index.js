const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

const port = process.env.port || 3000

//using middleware
app.use((req, res, next) => {
    res.status(503).send('Site is under maintenance...')
})

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



app.listen(port, () => {
    console.log("listening to server on port" + port)
})



