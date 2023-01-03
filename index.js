import express from 'express'
import mongoose from "mongoose"
import { login, register } from './controllers/UserController.js'

const port = 5000
const app = express()

app.use(express.json())

mongoose.connect('mongodb+srv://myName:qazzaq12345@cluster0.0qnzfyg.mongodb.net/my-project?retryWrites=true&w=majority')
.then(() => console.log('DB ok'))
.catch((err) => console.log("DB err", err))

app.post('/register', register)
app.post('/login', login)


app.listen(port, () => {
    console.log(`port ${port}`)
})