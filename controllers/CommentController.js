import CommentModel from '../models/Coment.js'
import PostModel from '../models/Post.js'


export const createComment = async (req, res) => {
    try{
        const postId = req.params.id
        const text = req.body.text
        
       const comment = new CommentModel({
        text,
        user: req.user._id
        })

       await comment.save()
       try {
        await PostModel.findByIdAndUpdate(postId, {
        $push: {comments: comment._id}
        })
       } catch (err) {
        
       }
      
       res.json({
        success: true,
        comment
       })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: 'Failed create comment'
        })
    }
}

export const getCommentsByPostId = async (req, res) => {
    const postId = req.params.id

    const post = await PostModel.findById(postId)

    const list = await Promise.all(post?.comments.map((commentId) => {
        return CommentModel.findById(commentId).populate('user', 'name').populate({path: 'user', select: ['name', 'color']})
    }))

    res.json({
        success: true,
        list,
    })
}

export const deleteComment = async (req, res) => {
    const {postId, commentId} = req.params


    await PostModel.updateOne({
        _id: postId
    },{
        $pull: {comments: commentId}
    })

    await CommentModel.deleteOne({
        _id: commentId
    })


    res.json({
        success: true,
    })
}

export const changeComment = async (req, res) => {
    try {
        const id = req.params.id

        await CommentModel.updateOne({
            _id: id
        },
        {
            text: req.body.text,
        })
        res.json({
            success: true 
        })
    } catch (err) {
        console.log(err)
    }
}