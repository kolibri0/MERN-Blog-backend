import UserModel from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const register = async (req, res) => {
  try {

    const userPassword = req.body.password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(userPassword, salt)

    const doc = new UserModel({
      email: req.body.email,
      password: hash,
      name: req.body.name
    })
    const user = await doc.save()

    if (!user) {
      res.json({
        message: "Failed to create user"
      })
    }

    const token = jwt.sign({
      _id: user._id
    }, process.env.KEY_FOR_REGISTER,
      {
        expiresIn: '30d'
      })

    const { password, ...userData } = user._doc

    res.json({
      ...userData,
      token,
    })
  } catch (err) {
    res.status(500).json({
      message: "Failed to register"
    })
  }
}
export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(404).json({
        msg: 'User not found'
      })
    }
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.password)

    if (!isValidPass) {
      return res.status(404).json({
        msg: 'Incorrect login or password'
      })
    }
    const token = jwt.sign({
      _id: user._id
    }, process.env.KEY_FOR_REGISTER,
      {
        expiresIn: '30d'
      })
    const { password, ...userData } = user._doc

    res.json({
      ...userData,
      token,
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: "Failed to login"
    })
  }
}

export const checkMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id)
      .populate({ path: 'followers', select: ['name', 'color'] })
      .populate({ path: 'youFollow', select: ['name', 'color'] })

    if (!user) {
      return res.status(404).json({
        msg: 'User not found'
      })
    }
    const { password, ...userData } = user._doc

    res.json({
      ...userData,
    })
  } catch (err) {
    res.json({
      msg: 'server error'
    })
  }
}
export const changeMe = async (req, res) => {
  try {
    UserModel.findByIdAndUpdate({
      _id: req.params.id
    }, {
      name: req.body.name,
      color: req.body.color,
      aboutMe: req.body.aboutMe
    },
      {
        returnDocument: 'after'
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            msg: "can't change user"
          })
        }
        if (!doc) {
          return res.status(404).json({
            msg: "can't get User"
          })
        }
        const { password, ...userData } = doc._doc
        res.json({
          ...userData,
          success: true
        })
      })

  } catch (err) {
    res.json({
      msg: 'server error'
    })
  }
}

export const getUser = async (req, res) => {
  try {

    const id = req.params.id


    const user = await UserModel.findById(id)
      .populate({ path: 'followers', select: ['name', 'color'] })
      .populate({ path: 'youFollow', select: ['name', 'color'] })
    if (!user) {
      return res.status(404).json({
        msg: 'User not found'
      })
    }
    const { password, email, __v, ...userData } = user._doc

    res.json({
      ...userData,
    })
  } catch (err) {
    res.json({
      msg: 'server error'
    })
  }
}

export const followOnUser = async (req, res) => {
  try {
    const { followUserId, userId } = req.params

    await UserModel.findByIdAndUpdate({
      _id: followUserId
    }, {
      $push: { followers: userId }
    })

    await UserModel.findOneAndUpdate({
      _id: userId
    }, {
      $push: { youFollow: followUserId }
    }, {
      returnDocument: 'after'
    }, (err, doc) => {
      if (err) {
        return res.status(500).json({
          msg: 'Error follow'
        })
      }
      if (!doc) {
        return res.status(404).json({
          msg: 'User not found'
        })
      }
      const { password, email, __v, ...userData } = doc._doc
      res.json({
        ...userData
      })
    })
      .populate({ path: 'followers', select: ['name', 'color'] })
      .populate({ path: 'youFollow', select: ['name', 'color'] })
  } catch (err) {
    console.log(err)
  }
}

export const deleteFollowOnUser = async (req, res) => {
  try {
    const { followUserId, userId } = req.params

    await UserModel.findByIdAndUpdate({
      _id: followUserId
    }, {
      $pull: { followers: userId }
    })

    await UserModel.findOneAndUpdate({
      _id: userId
    }, {
      $pull: { youFollow: followUserId }
    }, {
      returnDocument: 'after'
    }, (err, doc) => {
      if (err) {
        return res.status(500).json({
          msg: 'Error follow'
        })
      }
      if (!doc) {
        return res.status(404).json({
          msg: 'User not found'
        })
      }
      const { password, email, __v, ...userData } = doc._doc
      res.json({
        ...userData
      })
    })
      .populate({ path: 'followers', select: ['name', 'color'] })
      .populate({ path: 'youFollow', select: ['name', 'color'] })
  } catch (err) {
    console.log(err)
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const { name } = req.params
    const users = []
    if (name) {
      const doc = await UserModel.find({ name: name })
      doc.map(user => users.push({
        name: user.name,
        _id: user._id,
        color: user.color
      }))
      return res.json({
        users
      })
    }
    const doc = await UserModel.find()

    doc.map(user => users.push({
      name: user.name,
      _id: user._id,
      color: user.color
    }))
    return res.json({
      users
    })
  } catch (err) {

  }
}

export const getFamousePeople = async (req, res) => {
  try {
    const users = []

    const doc = await UserModel.find()

    doc.map(user => users.push({
      name: user.name,
      _id: user._id,
      color: user.color,
      followers: user.followers.length
    }))

    const result = users.sort((a, b) => b.followers - a.followers)

    return res.json({
      result: result.slice(0, 10),
      asd: '2'
    })
  } catch (err) {

  }
}