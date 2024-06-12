import PostController from "../controller/PostController"
import {Response,Request,NextFunction, Router} from 'express';


export default () : Router => {
    const controller = new PostController()
    const router = Router()
    router.get(
        "/",
        (req :Request,res:Response ,next: NextFunction) => controller.getPostsExplore(req,res,next)
    )
    router.post(
        "/",
        (req :Request,res:Response ,next: NextFunction) => controller.createPost(req,res,next)
    )
    router.patch(
        "/:id",
        (req :Request,res:Response ,next: NextFunction) => controller.updatePostById(req,res,next)
    )
    router.delete(
        "/:id",
        (req :Request,res:Response ,next: NextFunction) => controller.deletePostById(req,res,next)
    )
    router.post(
        "/:id/like",
        (req :Request,res:Response ,next: NextFunction) => controller.likePostById(req,res,next)
    )
    router.get(
        "/:id",
        (req :Request,res:Response ,next: NextFunction) => controller.getPostById(req,res,next)
    )
    router.get(
        "/:id/children",
        (req :Request,res:Response ,next: NextFunction) => controller.getPostChildrenById(req,res,next)
    )
    
    return router

}