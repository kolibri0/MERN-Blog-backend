import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'black'
    },
    aboutMe: {
      type: String,
      required: false
    },
    followers:
      [
        {
          type: mongoose.Types.ObjectId,
          ref: 'User',
          required: false
        }
      ],
    youFollow:
      [
        {
          type: mongoose.Types.ObjectId,
          ref: 'User',
          required: false
        }
      ]
  },
  {
    timestamps: true,
  }
)
export default mongoose.model('User', UserSchema)