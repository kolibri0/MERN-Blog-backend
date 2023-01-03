import TodoModel from '../models/Todo.js'

export const createTodo = async (req, res) => {
    try {
        const doc = new TodoModel({
            text: req.body.text,
            user: req.user._id,
        })
    
        if(!doc){
            return res.status(400).json({
                msg: 'Failed create todo'
            })
        }
        const todos = await doc.save()
    
        res.json({
            todos
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Failed create todo'
        })
    }
}

export const getTodo = async (req, res) => {
    try {
        const todos = await TodoModel.find({user: req.user._id})
        res.json({
            todos
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Failed to find todo'
        })
    }
}

export const removeTodo = async (req, res) => {
    const id = req.params.id

    TodoModel.findOneAndDelete({
        _id: id
    })

    res.json({
        succes: true
    })
}