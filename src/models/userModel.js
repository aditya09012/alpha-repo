import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt"
import { generate } from "otp-generator"; "otp-generator"

const Schema = mongoose.Schema

const userSchema = new Schema({
    email : {type: String, required: true, unique: true},
    password: {type: String},
    otp: {type: String}
}, {timestamps : true})

userSchema.methods.generateOtp = function(){
    const OTP = generate(6, {upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false})
    this.otp = OTP
    return OTP
}
userSchema.methods.verifyOtp = function(userOtp){
    const verify = this.otp === userOtp
    if(verify) this.otp = "Verified"
    return verify
}
userSchema.methods.isVerified = function(){
    return this.otp.includes("Verified")
}

userSchema.methods.hashPassword = async function(password){
    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        this.password = hash
    } catch (error) {
        console.log(error);
        return Promise.reject(error)   
    }
}

userSchema.methods.comparePassword = async function(password){
    try {
        const result = await bcrypt.compare(password, this.password)
        // true if match otherwise false

        return result
    } catch (error) {
        console.log(error)
        return Promise.reject(error)   
    }
}

userSchema.methods.changeEmail = function(email){
    this.email = email
}

const User = mongoose.model('User', userSchema, "users")

export default User