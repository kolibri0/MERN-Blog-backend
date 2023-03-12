import express from 'express'
import mongoose from "mongoose"
import cors from 'cors'
import { createTodo, getTodo, removeTodo } from './controllers/TodoController.js'
import { changeMe, checkMe, getUser, login, register } from './controllers/UserController.js'
import { checkAuth } from './utils/checkAuth.js'
import { changeNote, createNote, getAll, getOne, removeNote } from './controllers/NoteController.js'
import { changePost, createPost, getAllPosts, getMyPosts, getNewPosts, getOnePost, getPopularPosts, getPostsByTags, getTags, getUserPosts, removePost } from './controllers/PostController.js'
import { changeComment, createComment, deleteComment, getCommentsByPostId } from './controllers/CommentController.js'
import multer from 'multer'
// import env from 'process'
import * as dotenv from 'dotenv'

dotenv.config()
const port = process.env.PORT
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

mongoose.connect(process.env.MONGO_DB_URL)
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

app.patch('/user/:id', checkAuth, changeMe )
app.get('/user/:id', getUser )
app.get('/user/posts/:id', getUserPosts )

app.post('/todos', checkAuth,  createTodo)
app.get('/todos', checkAuth, getTodo)
app.delete('/todos/:id', checkAuth, removeTodo)

app.get('/note', checkAuth, getAll)
app.get('/note/:id', getOne)
app.post('/note', checkAuth, createNote)
app.patch('/note/:id', checkAuth, changeNote)
app.delete('/note/:id', checkAuth, removeNote)

app.get('/posts', getAllPosts)
app.get('/posts/new', getNewPosts)
app.get('/posts/popular', getPopularPosts)
// app.get('/posts/my', checkAuth, getMyPosts)

app.get('/posts/:id', getOnePost)

app.post('/posts', checkAuth, createPost)
app.patch('/posts/:id', checkAuth, changePost)
app.delete('/posts/:id', checkAuth, removePost)

app.get('/posts/params/:param', getPostsByTags)
app.get('/tags', getTags)

app.delete('/posts/:postId/comments/:commentId', checkAuth, deleteComment)
app.patch('/comments/:id', checkAuth, changeComment)
app.post('/comments/:id', checkAuth, createComment)
app.get('/comments/:id', getCommentsByPostId)



app.listen(port, () => {
    console.log(`port ${port}`)
})