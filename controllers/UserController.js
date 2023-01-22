import UserModel from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const register = async (req, res) =>{
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

        const token = jwt.sign({
            _id: user._id
        }, 'key',
        {
            expiresIn: '30d'
        })

        const {password, ...userData} = user._doc

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
        const user = await UserModel.findOne({email: req.body.email})
        if(!user){
            return res.status(404).json({
                msg: 'User not found'
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.password)

        if(!isValidPass){
            return res.status(404).json({
                msg: 'Incorrect login or password'
            })
        }
        const token = jwt.sign({
            _id: user._id
        }, 'key',
        {
            expiresIn: '30d'
        })
        const {password, ...userData} = user._doc

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
        if(!user){
            return res.status(404).json({
                msg: 'User not found'
            })
        }
        const {password, ...userData} = user._doc

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
        },{   
            name: req.body.name,
            color: req.body.color
        },
        {
            returnDocument: 'after'
        },
        (err, doc) => {
            if(err){
                return res.status(500).json({
                    msg: "can't change user"
                })
            }
            if(!doc){
                return res.status(404).json({
                    msg: "can't get User"
                })
            }
            const {password, ...userData} = doc._doc
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
        if(!user){
            return res.status(404).json({
                msg: 'User not found'
            })
        }
        const {password, email, __v, ...userData} = user._doc

        res.json({
            ...userData,
        })
    } catch (err) {
        res.json({
            msg: 'server error'
        })
    }
}