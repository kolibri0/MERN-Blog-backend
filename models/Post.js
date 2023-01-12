import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        // imgUrl:{
        //     type: String,
        //     default: ''
        // },
        imgUrl: String,
        comments:[
            {
                text: String,
                user:{
                    type:  mongoose.Types.ObjectId,
                    ref: 'User'
                }
            }
        ],
        views: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
    }
)
export default mongoose.model('Post', PostSchema)