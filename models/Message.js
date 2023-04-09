import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    roomId: {
      type: mongoose.Types.ObjectId,
      ref: 'Chat'
    }
  },
  {
    timestamps: true,
  }
)
export default mongoose.model('Message', MessageSchema)