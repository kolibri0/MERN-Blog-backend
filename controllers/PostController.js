import PostModel from '../models/Post.js'
import CommentModel from '../models/Coment.js'


export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate({ path: 'user', select: ['name', 'color'] })

    res.json({
      posts,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      msg: 'Failed get posts'
    })
  }
}

export const getNewPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate({ path: 'user', select: ['name', 'color'] }).sort({ _id: -1 })

    res.json({
      posts,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      msg: 'Failed get posts'
    })
  }
}

export const getPopularPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate({ path: 'user', select: ['name', 'color'] }).sort({ views: -1 })

    res.json({
      posts,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      msg: 'Failed get posts'
    })
  }
}

export const getMyPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({ user: req.user._id })

    res.json({
      posts,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      msg: 'Failed get posts'
    })
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({ user: req.params.id }).populate({ path: 'user', select: ['name', 'color'] })

    res.json({
      posts,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      msg: 'Failed get posts'
    })
  }
}

export const getOnePost = async (req, res) => {
  try {
    const id = req.params.id
    PostModel.findOneAndUpdate({
      _id: id
    }, {
      $inc: { views: 1 }
    }, {
      returnDocument: 'after'
    }, (err, doc) => {
      if (err) {
        return res.status(500).json({
          msg: 'Error get post'
        })
      }
      if (!doc) {
        return res.status(404).json({
          msg: 'Post not found'
        })
      }
      res.json({
        post: doc
      })
    }).populate({ path: 'user', select: ['name', 'color'] })
  } catch (err) {
    res.status(500).json({
      msg: 'Failed get post'
    })
  }
}

export const createPost = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      user: req.user._id,
      tags: req.body.tags,
      imgUrl: req.body.imgUrl,
    })

    if (!doc) {
      return res.status(400).json({
        msg: 'Failed create post'
      })
    }
    const post = await doc.save()

    res.json({
      post,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      msg: 'Failed create post'
    })
  }
}

export const changePost = async (req, res) => {
  try {
    const id = req.params.id
    PostModel.findByIdAndUpdate({
      _id: id
    },
      {
        title: req.body.title,
        text: req.body.text,
        user: req.user._id,
        tags: req.body.tags,
        imgUrl: req.body.imgUrl
      },
      {
        returnDocument: 'after'
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            msg: "can't change post"
          })
        }
        if (!doc) {
          return res.status(404).json({
            msg: "can't get post"
          })
        }
        res.json({
          doc,
          success: true
        })
      })

  } catch (err) {
    res.status(500).json({
      msg: 'Failed change Post'
    })
  }
}

export const removePost = async (req, res) => {
  try {
    const id = req.params.id
    await PostModel.findOneAndDelete({
      _id: id
    })

    res.json({
      success: true
    })
  } catch (err) {
    res.status(500).json({
      msg: 'Failed get post'
    })
  }
}

export const getPostsByTags = async (req, res) => {
  try {

    const param = req.params.param

    const data = await PostModel.find().populate('user', 'name')

    let posts = []

    data.map((post) => post.tags.includes(param) ? posts.push(post) : null)

    res.json({
      posts,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      msg: 'Failed get tags'
    })
  }
}

export const getTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(20).exec()
    const data = posts.map(post => post.tags).flat().slice(0, 20)
    const set = new Set(data)
    const tags = [...set]

    res.json({
      tags,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      msg: 'Failed get tags'
    })
  }
}