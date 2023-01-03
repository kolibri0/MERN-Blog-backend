import express from 'express'
import mongoose from "mongoose"
import { createTodo, getTodo, removeTodo } from './controllers/TodoController.js'
import { login, register } from './controllers/UserController.js'
import { checkAuth } from './utils/checkAuth.js'

const port = 5000
const app = express()

app.use(express.json())

mongoose.connect('mongodb+srv://myName:qazzaq12345@cluster0.0qnzfyg.mongodb.net/my-project?retryWrites=true&w=majority')
.then(() => console.log('DB ok'))
.catch((err) => console.log("DB err", err))

app.post('/register', register)
app.post('/login', login)

app.post('/todos', checkAuth, createTodo)
app.get('/todos', checkAuth, getTodo)
app.delete('/todos/:id', checkAuth, removeTodo)


app.listen(port, () => {
    console.log(`port ${port}`)
})