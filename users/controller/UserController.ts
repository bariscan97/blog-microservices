import {NextFunction,Response,Request} from "express"
import UserService from "../service/UserService"
import {UpdateJwt} from "../utils/updateToken"

class UserController{
    
    userService : UserService
    constructor(){
        this.userService = new UserService()
    
    }

    public async createUser(req: Request ,res :Response, next :NextFunction) :Promise<Response | void>{
        
        try{
            const result = await this.userService.createUser(req.body)
            return res.json({
                result:result
            })
        }catch(err){
            next(new Error(err.message))
        }
        
    } 
    public async updateMe(req: Request ,res :Response,next:NextFunction):Promise<Response | void>{
        
        try{
            const {body} = req
            const new_credential = Object.assign(req.user, body);
            const result = await this.userService.updateMe(req.body,req.user.id)
            UpdateJwt(new_credential , res)
        }catch(err){
            next(new Error(err.message))
        }
    
    }
    public async deleteMe(req: Request ,res :Response,next: NextFunction):Promise<Response | void>{
        
        try{
            const result = await this.userService.deleteMe(req.user.id)
            res.json({
                result
            })
            
        }catch(err){
            next(new Error(err.message))
        }
        
    }
 
    public async getUserById(req: Request ,res :Response,next:NextFunction):Promise<Response | void>{
        try{
            
            const result = await this.userService.getUserById(req.user.id, req.params.id)
            res.json({
                result:result
            })
        }catch(err){
            next(new Error(err.message))
        }
    }
    public async followUserById(req: Request ,res :Response,next:NextFunction):Promise<Response | void>{
        try{
            const data =  await this.userService.followUserById(req.user.id,req.params.id)
            return res.json({
                result:data
            })
        }catch(err){
            next(new Error(err.message))
        }
    }
    public async blockUserById(req: Request ,res :Response,next:NextFunction):Promise<Response | void>{
        try{
            const result = await this.userService.blockUserById(req.user.id,req.params.id)
            return res.json({
                result:result
            })
        }catch(err){
            next(new Error(err.message))
        }
    }
    public async getMyBlockList(req: Request ,res :Response,next:NextFunction):Promise<Response | void>{
        try{
            const result = await this.userService.getMyBlockList(req.user.id,req.params.page)
            return res.json({
                result:result
            })
        }catch(err){
            next(new Error(err.message))
        }
    }
    public async getUserFollowersListById(req: Request ,res :Response,next:NextFunction):Promise<Response | void>{
        try{
            const result = await this.userService.getUserFollowersListById(req.user.id,req.params.id,req.query.page as string)
            return res.json({
                result:result
            })
        }catch(err){
            next(new Error(err.message))
        }
    }
    public async getUserFollowingListById(req: Request ,res :Response,next:NextFunction):Promise<Response | void>{
        try{
            
            const result = await this.userService.getUserFollowingListById(req.user.id,req.params.id,req.query.page as string)
            return res.json({
                result:result
            })
        }catch(err){
            next(new Error(err.message))
        }
    }
 
    public async checkUserExist(req: Request ,res :Response,next:NextFunction){
        try{
            const result = await this.userService.checkUserExist(req.params.name) 
            return res.json({
                result:result
            })

        }catch(err){
            next(new Error(err.message))
        }
    }
    public async searchUserByName(req:Request ,res:Response,next:NextFunction){
        try{
            const result = await this.userService.searchUserByName(req.query.name as string)
        }catch(err){
            next(new Error(err.message))
        }
    }
}

export default UserController

