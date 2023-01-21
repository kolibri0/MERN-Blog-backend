import express from 'express'
import mongoose from "mongoose"
import cors from 'cors'
import { createTodo, getTodo, removeTodo } from './controllers/TodoController.js'
import { checkMe, login, register } from './controllers/UserController.js'
import { checkAuth } from './utils/checkAuth.js'
import { changeNote, createNote, getAll, getOne, removeNote } from './controllers/NoteController.js'
import { changePost, createPost, getAllPosts, getMyPosts, getOnePost, getPostsByTags, getTags, removePost } from './controllers/PostController.js'
import { changeComment, createComment, deleteComment, getCommentsByPostId } from './controllers/CommentController.js'
import multer from 'multer'

const port = 5000
const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) =>{
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage})

app.use(express.json())
app.use('/uploads', express.static("uploads"))
app.use(cors())

mongoose.connect('mongodb+srv://myName:qazzaq12345@cluster0.0qnzfyg.mongodb.net/my-project?retryWrites=true&w=majority')
.then(() => console.log('DB ok'))
.catch((err) => console.log("DB err", err))

app.post('/register', register)
app.post('/login', login)
app.get('/me', checkAuth, checkMe)

app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

app.post('/todos', checkAuth,  createTodo)
app.get('/todos', checkAuth, getTodo)
app.delete('/todos/:id', checkAuth, removeTodo)

app.get('/note', checkAuth, getAll)
app.get('/note/:id', checkAuth, getOne)
app.post('/note', checkAuth, createNote)
app.patch('/note/:id', checkAuth, changeNote)
app.delete('/note/:id', checkAuth, removeNote)

app.get('/posts', getAllPosts)
app.get('/posts/my', checkAuth, getMyPosts)
app.get('/posts/:id', checkAuth, getOnePost)
app.post('/posts', checkAuth, createPost)
app.patch('/posts/:id', checkAuth, changePost)
app.delete('/posts/:id', checkAuth, removePost)

app.get('/posts/params/:param', getPostsByTags)
app.get('/tags', getTags)

app.delete('/posts/:postId/comments/:commentId', checkAuth, deleteComment)
app.patch('/comments/:id', checkAuth, changeComment)
app.post('/comments/:id', checkAuth, createComment)
app.get('/comments/:id', checkAuth, getCommentsByPostId)



app.listen(port, () => {
    console.log(`port ${port}`)
})