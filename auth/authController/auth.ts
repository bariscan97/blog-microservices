import {Request,Response,NextFunction} from "express";
import axios from "axios";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {Rabbitmqservice} from "../messageBroker/BasePublisher"
import {SendJwt, generateJwtFromUser, removeJwt} from "../utils/sendJwt"
import Cahce from "../cache/Cache"
import {isValidUser ,isValidPassword } from "../utils/validation"
import CustomError from "../utils/CustomErorr"
import local from "../config/congifMap"

const Local = local.configs()

export default class AuthController{
    
    private producer = new Rabbitmqservice()
    
    constructor(){}

    public async login(req:Request,res:Response,next:NextFunction){
        try{
            // let req_email :string  = req.body.email
            // let user_email:string = req_email.substring(0,req_email.lastIndexOf("."))
    
            const check = (await axios.get(`http://localhost:3000/users/checkUserExists/${req.body.name}`)).data.result
            console.log(check)
            
            if (check.length === 0){
                next(new CustomError("user not exists"))
            }
            const user = check[0]
            
            const validated = await bcrypt.compare(req.body.password,user.password)
            if (!validated){
                next(new CustomError("password not match"))
            }
            const {id , password , ...credential} = user
            SendJwt(credential, res)
        }catch(err){
            next(new CustomError(err.message))
        }
    }   
    public async forgotPasswordVerify(req: Request,res : Response, next : NextFunction){
        try{
            const { resetPasswordToken } = req.query
            
            const credential = jwt.verify(resetPasswordToken as any ,Local.get("JWT_SECRET_KEY"))
            
            const user_email:string = credential.substring(0,credential.lastIndexOf("."))
            
            const token = await Cahce.getItem(credential[user_email])
            
            const now : Date = new Date(Date.now())

            if(!resetPasswordToken || resetPasswordToken !== token || Number(now) >  Number(credential["expire"])){
                next(new Error("invalid token"))
            }
           
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                <title>Reset Password</title>
                </head>
                <body>
                <h2>new password</h2>
                    <form action="${process.env.BASE_URL}/reset-password" method="POST">
                        <input type="hidden" name="token" value="${resetPasswordToken}"/>
                        <label for="password">password</label>
                        <input type="password" id="password" name="password" required />
                        <button type="submit"> submit </button>
                    </form>
                </body>
                </html>
            `)

        }catch(err){
            next(new CustomError(err.message))
        }
    }
    public async forgotPassword(req: Request,res : Response, next : NextFunction){
        try{
            let req_email :string  = req.body.email
            let user_email:string = req_email.substring(0,req_email.lastIndexOf("."))
            
            const user = (await axios.get(`http://localhost:3000/users/checkUserExists/${req.body.name}`)).data.result
            if (user.length === 0){
                throw new Error("user not exists")
            }
            const {password , ...credential} = user[0]
            const token = generateJwtFromUser(credential)
            await Cahce.addItem(user_email,token)
            this.producer.publichInQueue("email",JSON.stringify({
                type : "forgotPassword",
                to: req_email,
                token : token
                
            }))
            return res.json({
                message:"sent to your email account"
            })
        }catch(err){
            next(new CustomError(err.message))
        }
    }
    
    public async resetPassword(req: Request,res : Response, next : NextFunction){
        try{
            
            const {password , resetPasswordToken} = req.body
            
            const credential = jwt.verify(resetPasswordToken as any ,Local.get("JWT_SECRET_KEY"))
           
            const user_email:string = credential.substring(0,credential.lastIndexOf("."))
            
            const token = await Cahce.getItem(credential[user_email])
            
            const now : Date = new Date(Date.now())
            
            console.log(credential)
            

            if(!resetPasswordToken || resetPasswordToken !== token || Number(now) >  Number(credential["expire"])){
                next(new Error("invalid token"))
            }
            
            isValidPassword.parse(password)

            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = await bcrypt.hash(password,salt) 
            
            await Cahce.removeItem(credential[user_email])
            
            await axios.patch(`http://localhost:3000/user}`,hashedPassword,{
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.json({
                message:"reset password succesful"
            })
        }catch(err){
            next(new CustomError(err.message))
        }
    }  
    public async registerSendEmail(req: Request,res : Response, next : NextFunction){
        try{
            const {name, email, password,img_url} = req.body
            let user_email:string = email.substring(0,email.lastIndexOf("."))
            isValidUser.parse(req.body)
            const userExist = (await axios.get(`http://localhost:3000/users/checkUserExists/${req.body.name}`)).data.result
            if(userExist > 0){
                next(new CustomError("User already exists"))
            }
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = await bcrypt.hash(password,salt) 
            const payload ={
                name : name,
                email : user_email,
                img_url: img_url,
                password : hashedPassword,
                date: new Date(Date.now() + Number(1000000)) 
            }
            const token = generateJwtFromUser(payload)
            
            await Cahce.setAddToken(token)
            
            this.producer.publichInQueue("email",JSON.stringify({
                type:"register",
                to: email,
                token : token
                
            }))
            return res.json({
                message:"sent to your email account"
            })
        }catch(err){
            next(new CustomError(err.message))
        }
    }
    public async registerVerify(req: Request,res : Response, next : NextFunction){
        try{
            const {token} = req.query
            const isInSet = await Cahce.checkTokenExists(token as string)
            
            if (!token || !isInSet) return next(new CustomError("Please check your token"))
            
            await Cahce.removeToken(token as string)

            const {date ,iat,exp, ...credential} : any = jwt.verify(token as any,Local.get("JWT_SECRET_KEY"))
            
            const now : Date = new Date(Date.now())
            console.log(credential)
            if (Number(now) > Number(date)){
                return next(new Error("The token has expired"))
            }
            
            const result = await axios.post("http://localhost:3000/users",credential)
            
            return res.json({
                result
            })
        }catch(err){
            next(new CustomError(err.message))
        }
    }
    public async logout(req: Request,res : Response){
        return removeJwt(res)
    }

}