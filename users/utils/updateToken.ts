import jwt from "jsonwebtoken"
import Local from "../config/congifMap"
import { Response } from "express"
const local = Local.configs()

export function UpdateJwt(userDto:any,res:Response){
    
    const token = generateJwtFromUser(userDto)
    
    return res
    .status(200)
    .cookie("access-token",token,{
        httpOnly: true,
        expires: local.get("JWT_EXPIRE"),
        secure: local.get("NODE_ENV") === "development" ? false : true
    })
    .json({
        success:true,
        access:token,
        data:{
            userDto : userDto
        }
    })
    
}
export function generateJwtFromUser(credential:any){
    
    return jwt.sign(credential,local.get("JWT_SECRET_KEY"),{
        expiresIn : local.get("JWT_EXPIRE")
    })
    
}