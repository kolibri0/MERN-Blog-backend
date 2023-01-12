import express from 'express'
import mongoose from "mongoose"
import cors from 'cors'
import { createTodo, getTodo, removeTodo } from './controllers/TodoController.js'
import { checkMe, login, register } from './controllers/UserController.js'
import { checkAuth } from './utils/checkAuth.js'
import { changeNote, createNote, getAll, getOne, removeNote } from './controllers/NoteController.js'
import { changePost, createPost, getAllPosts, getMyPosts, getOnePost, removePost } from './controllers/PostController.js'
import { createComment } from './controllers/CommentController.js'

const port = 5000
const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect('mongodb+srv://myName:qazzaq12345@cluster0.0qnzfyg.mongodb.net/my-project?retryWrites=true&w=majority')
.then(() => console.log('DB ok'))
.catch((err) => console.log("DB err", err))

app.post('/register', register)
app.post('/login', login)
app.get('/me', checkAuth, checkMe)

app.post('/todos', checkAuth, createTodo)
app.get('/todos', checkAuth, getTodo)
app.delete('/todos/:id', checkAuth, removeTodo)

app.get('/note', checkAuth, getAll)
app.get('/note/:id', checkAuth, getOne)
app.post('/note', checkAuth, createNote)
app.patch('/note/:id', checkAuth, changeNote)
app.delete('/note/:id', checkAuth, removeNote)

app.get('/posts', checkAuth, getAllPosts)
app.get('/posts/my', checkAuth, getMyPosts)
app.get('/posts/:id', checkAuth, getOnePost)
app.post('/posts', checkAuth, createPost)
app.patch('/posts/:id', checkAuth, changePost)
app.delete('/posts/:id', checkAuth, removePost)


// app.patch('/comment/:id', checkAuth, createComment)
app.post('/comment/:id', checkAuth, createComment)



app.listen(port, () => {
    console.log(`port ${port}`)
})