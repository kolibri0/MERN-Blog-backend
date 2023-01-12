import CommentModel from '../models/Coment.js'
import PostModel from '../models/Post.js'

// export const createComment = async (req, res) => {
//     try{
//         const id = req.params.id
//         const post = await PostModel.findById(id)
        
//        const comment = {
//         text: req.body.text,
//         user: req.user._id
//        }
        
//     post.comments.unshift(comment)
//     await post.save()
//        res.json({
//         success: true
//        })
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({
//             msg: 'Failed create Post'
//         })
//     }
// }

export const createComment = async (req, res) => {
    try{
        const postId = req.params.id
        const post = await PostModel.findById(postId)
        
       const doc = new CommentModel({
        text: req.body.text,
        user: req.user._id
       })

       const comment = await doc.save()
        
        post.comments.unshift(comment)
        await post.save()
        res.json({
            success: true
       })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: 'Failed create Post'
        })
    }
}