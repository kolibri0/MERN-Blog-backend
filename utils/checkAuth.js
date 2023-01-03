import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'


export const checkAuth = async (req, res, next) =>{
    const token = req.headers.authorization?.split(' ')[1] || ''
    if(!token){
        return res.json({
            msg: 'you not register'
        })
    }

    const decoded = jwt.verify(token, 'key')
    req.user = await UserModel.findById(decoded)
    next()
}