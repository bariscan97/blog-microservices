import jwt from "jsonwebtoken"
import Local from "../config/congifMap"
import { Response } from "express"

const local = Local.configs()

export function SendJwt(userDto:Object,res:Response){
    
    Object.assign(userDto,{expire:local.get("JWT_EXPIRE")})
    
    const token = generateJwtFromUser(userDto)
    
    res
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

export async function removeJwt(res : Response){
    return res
    .status(200)
    .cookie("access-token","",{
        httpOnly: true,
        expires: local.get("JWT_EXPIRE"),
        secure: local.get("NODE_ENV") === "development" ? false : true
    })
    .json({
        success:true
    })
}