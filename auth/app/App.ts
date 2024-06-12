import express, {Request,Response, NextFunction } from "express"
import AuthController from "../authController/auth"
import local from "../config/congifMap"

const Local = local.configs()

export default class App{
    AuthController : AuthController
    app : express.Application
    router : express.Router
    constructor(){
        this.AuthController = new AuthController()
        this.app =  express()
        this.router = express.Router()
        this.intializeRoutes()
    }
    middlewares(){
        this.app.use(express.json())
        this.app.use("/",this.router)
    }
    
    intializeRoutes (){
        this.router.post("/login",(req:Request,res:Response,next:NextFunction) => this.AuthController.login(req,res,next))    
        this.router.post("/logout",(req:Request,res:Response,next:NextFunction) => this.AuthController.logout(req,res))   
        this.router.post("/register-send-mail",(req:Request,res:Response,next:NextFunction) => this.AuthController.registerSendEmail(req,res,next))
        this.router.post("/register-verify",(req:Request,res:Response,next:NextFunction) => this.AuthController.registerVerify(req,res,next))
        this.router.post("/forgot-password",(req:Request,res:Response,next:NextFunction) => this.AuthController.forgotPassword(req,res,next))
        this.router.post(
            "/reset-password",(req:Request,res:Response,next:NextFunction) => 
            req.query.resetPasswordToken 
            ? 
            this.AuthController.forgotPasswordVerify(req,res,next)
            :
            this.AuthController.resetPassword
        )
    }   
    init(){
        this.middlewares()
        this.app.listen(Local.get("PORT"),()=>{
            console.log("server started port:3001")
        })
    }
}