import MessageModel from "../models/Message.js";

export const createMsg = async (req, res) => {
  try {

    const doc = new MessageModel({
      text: req.body.text,
      user: req.user._id,
      roomId: req.body.roomId
    })

    if (!doc) {
      return res.status(400).json({
        msg: 'Failed send message!'
      })
    }

    const msg = await doc.save()

    res.json({
      msg,
      success: true,
    })

  } catch (err) {
    res.status(500).json({
      msg: 'Failed messages!'
    })
  }
}


export const getMsgs = async (req, res) => {
  try {

    const id = req.params.id

    const messages = await MessageModel.find({
      roomId: id
    })

    res.json({
      messages,
      success: true,
    })

  } catch (error) {

  }
}