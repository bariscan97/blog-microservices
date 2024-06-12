import {Response,Request,NextFunction, query} from "express"
import PostService from "../service/PostService"
import {CreatePostSchema,UpdatePostSchema} from "../utils/validation"
import {Publish} from "../messageBroker/producer"
import findTag from "../utils/findTag"
import generateRandomToken from "../utils/generateRandomToken"
import CustomError from "../utils/CustomErorr"

 



class PostController{
    
    public postService : PostService
    
    constructor(){
        this.postService = new PostService()
    }      
    
    public async createPost(req:Request ,res:Response,next: NextFunction): Promise<Response>{
        try{
            
            CreatePostSchema.parse(req.body)
            const acess_token = generateRandomToken()
            req.body["acess_token"] = acess_token
            const taggeds :string[] = findTag(req.body.content)
            const result = await this .postService.createPost(req.user.id,req.body)
            if (taggeds.length > 0){
                Publish({
                    type : "new_post",
                    from: req.user.name ,
                    acess: acess_token,
                    to : taggeds ,
                })
            }
           
            return res.status(200).json({
                result 
            })
        }catch(err){
            next(new CustomError(err.message))
        }
    }
    public async deletePostById(req:Request ,res:Response,next: NextFunction): Promise<Response>{
        try{
            const result = await this.postService.deletePostById(req.user.id,req.params.id)
            return res.status(200).json({
                result 
            })
        }catch(err){
            next(new CustomError(err.message))
        }
    }
    public async updatePostById(req:Request ,res:Response,next: NextFunction): Promise<Response>{
        try{
            UpdatePostSchema.parse(req.body)
            const taggeds :string[] = findTag(req.body.content)
            if (taggeds.length > 0){
                Publish({
                    type : "update_post",
                    acess: req.params.id,
                    from: req.user.name ,
                    to : taggeds ,
                })
            }
            const result = await this.postService.updatePostById(req.user.id,req.params.id,req.body)
            return res.status(200).json({
                result 
            })
        }catch(err){
            next(new CustomError(err.message))
        }
    }
    public async getPostById(req:Request ,res:Response,next: NextFunction): Promise<Response>{
        try{
            const result = await this.postService.getPostById(req.user.id,req.params.id)
            return res.status(200).json({
                result 
            })
        }catch(err){
            next(new CustomError(err.message))
        }
    }
    public async likePostById(req:Request ,res:Response,next: NextFunction): Promise<Response>{
        try{
            const result = await this.postService.likePostById(req.user.id,req.params.id)
            if (result.command === "INSERT"){
                Publish({
                    type : "like_post",
                    acess: req.params.id,
                    from: req.user.name ,
                    to : [req.body.post_user_name] ,
                })
            }
            return res.status(200).json({
                result 
            })
        }catch(err){
            next(new CustomError(err.message))
        }
    }
    public async getPostChildrenById(req:Request ,res:Response,next: NextFunction): Promise<Response>{
        try{
            const result = await this.postService.getPostChildrenById(req.user.id,req.params.id,req.query.page as string)
            return res.status(200).json({
                result 
            })
        }catch(err){
            next(new CustomError(err.message))
        }
    }
    public async getPostsExplore(req:Request, res:Response, next:NextFunction): Promise<Response>{
        try{
            const {cat ,page} = req.query
            const result = await this.postService.getPostsExplore(req.user.id,cat as string,page as string)
            return res.json({
                result
            })
        }catch(err){
            next(new CustomError(err.message))
        }
    }

     
    
   
}

export default PostController

