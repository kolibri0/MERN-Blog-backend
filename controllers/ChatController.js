import ChatModel from '../models/Chat.js'
import MessageModel from '../models/Message.js'


export const createChat = async (req, res) => {
  try {
    const { userOne, userTwo } = req.body
    // const repeat = await ChatModel.findOne({ userOne, userTwo })
    // { $or: [{ userOne: userId }, { userTwo: userId }] }
    const repeat = await ChatModel.findOne({
      $or: [
        { userOne: userOne, userTwo: userTwo },
        { userOne: userTwo, userTwo: userOne }
      ]
    })

    if (repeat) {
      return res.json({
        chat: repeat,
        success: true,
        con: 'repear'
      })
    }
    if (!repeat) {
      const doc = new ChatModel({
        userOne: userOne,
        userTwo: userTwo
      })

      if (!doc) {
        return res.status(400).json({
          msg: 'Failed create chat!'
        })
      }

      const chat = await doc.save()

      res.json({
        chat,
        success: true,
        asd: "sdas"
      })
    }

  } catch (err) {
    res.status(500).json({
      msg: 'Failed create chat!'
    })
  }
}



export const getUserChat = async (req, res) => {

  try {
    const { userId } = req.params

    const chats = await ChatModel.find({ $or: [{ userOne: userId }, { userTwo: userId }] }).populate('userOne', 'name').populate('userTwo', 'name')

    res.json({
      chats,
    })

  } catch (err) {

  }
}



// 63e2286b39e3a53d3544a19d
// 63ef8d0472fb5ff1cb6e19d5
//
// chat id 642f588bc78e629b73e91fdb