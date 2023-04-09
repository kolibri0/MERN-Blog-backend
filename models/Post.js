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
    tags: {
      type: Array,
      default: []
    },
    imgUrl: String,
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Comment'
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