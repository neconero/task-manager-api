require('../src/db/mongoose')
const Task = require('../src/models/task')



Task.findByIdAndRemove('5dba726e6cb4743a183f343c').then((task) => {
    console.log(task)
    return Task.countDocuments({completed: false})
}).then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e)
})