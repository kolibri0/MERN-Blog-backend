import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    }
)
export default mongoose.model('Todo', TodoSchema)