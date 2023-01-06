import NoteModel from '../models/Note.js'

export const createNote = async (req, res) => {
    try {
        const doc = new NoteModel({
            title: req.body.title,
            text: req.body.text,
            user: req.user._id,
        })
    
        if(!doc){
            return res.status(400).json({
                msg: 'Failed create note'
            })
        }
        const note = await doc.save()
    
        res.json({
            note
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Failed create note'
        })
    }
}

export const getAll = async (req, res) => {
    try{
        const note = await NoteModel.find({user: req.user._id})
        if(!note){
            return res.json({
                msg: 'not'
            })
        }
        res.json({
            note, 
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Failed create note'
        })
    }
}

export const getOne = async (req, res) => {
    try{
        const id = req.params.id
        const note = await NoteModel.findOne({
            _id: id
        })
        if(!note){
            return res.json({
                msg: 'not find'
            })
        }
        res.json({
            note, 
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Failed create note'
        })
    }
}

export const changeNote = async (req, res) => {
    try{
        const id = req.params.id
        await NoteModel.updateOne({
            _id: id
        },
        {
            title: req.body.title,
            text: req.body.text,
            user: req.user._id,
        })
        res.json({
            success: true 
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Failed change note'
        })
    }
}

export const removeNote = async (req, res) => {
    try {
        const id = req.params.id
        await NoteModel.findOneAndDelete({
            _id: id
        })
        const note = await NoteModel.find({user: req.user._id})
        res.json({
            success: true,
            note
        })
    } catch (err) {
        res.status(500).json({
            msg: "can't delete note"
        })
    }
}