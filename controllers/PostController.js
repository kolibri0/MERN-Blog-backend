import PostModel from '../models/Post.js'


export const getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find()

        res.json({
            posts,
            success: true
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Failed get posts'
        })
    }
}

export const getMyPosts = async (req, res) => {
    try {
        const posts = await PostModel.find({user: req.user._id})

        res.json({
            posts,
            success: true
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Failed get posts'
        })
    }
}

export const getOnePost = async (req, res) => {
    try {
        const id = req.params.id
        const post = await PostModel.findOne({
            _id: id
        })

        res.json({
            post,
            success: true
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Failed get post'
        })
    }
}

export const createPost = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            user: req.user._id,
            imgUrl: req.body.imgUrl,
        })
    
        if(!doc){
            return res.status(400).json({
                msg: 'Failed create post'
            })
        }
        const post = await doc.save()
    
        res.json({
            post,
            success: true
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Failed create post'
        })
    }
}

export const changePost = async (req, res) => {
    try{
        const id = req.params.id
        PostModel.findByIdAndUpdate({
            _id: id
        },
        {   
            title: req.body.title,
            text: req.body.text,
            user: req.user._id,
            imgUrl: req.body.imgUrl
        },
        {
            returnDocument: 'after'
        },
        (err, doc) => {
            if(err){
                return res.status(500).json({
                    msg: "can't change post"
                })
            }
            if(!doc){
                return res.status(404).json({
                    msg: "can't get post"
                })
            }
            res.json({
                doc,
                success: true
            })
        })
        
    } catch (err) {
        res.status(500).json({
            msg: 'Failed change Post'
        })
    }
}

export const removePost = async (req, res) => {
    try {
        const id = req.params.id
        await PostModel.findOneAndDelete({
            _id: id
        })

        res.json({
            success: true
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Failed get post'
        })
    }
}