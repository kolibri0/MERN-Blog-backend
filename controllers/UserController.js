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