import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    // users: [
    //   {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'User'
    //   }
    // ],
    userOne: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    userTwo: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
  },
  {
    timestamps: true,
  }
)
export default mongoose.model('Chat', ChatSchema)