import { JWT_SECRET_KEY } from "../../config"
import jwt from "jsonwebtoken"

export async function SaveJwt(payload, res){
    try {
        const expiresIn = 60 * 60 * 24 // hour
        const token = jwt.sign(payload, JWT_SECRET_KEY, {expiresIn})
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false
        })
    } catch (error) {
        // console.log(error)
        return Promise.reject(error)
    }
}