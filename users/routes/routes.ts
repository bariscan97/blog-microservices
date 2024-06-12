import UserController from "../controller/UserController"
import express,{Response,NextFunction ,Request} from "express"



export default () => {
    
    const router = express.Router()

    const userController : UserController = new UserController()
    
    router.post("/",
        (req:Request,res:Response,next:NextFunction) => userController.createUser(req,res,next)
    )
    router.delete("/",
        (req:Request,res:Response,next:NextFunction) => userController.deleteMe(req,res,next)
    )
    router.get("/:id",
        (req:Request,res:Response,next:NextFunction) =>userController.getUserById(req,res,next)
    )
    router.put("/:id",
        (req:Request,res:Response,next:NextFunction) => userController.updateMe(req,res,next)
    )
    router.get("/:id/followers-list",
        (req:Request,res:Response,next:NextFunction) => userController.getUserFollowersListById(req,res,next)
    )
    router.get("/:id/followings-list",
        (req:Request,res:Response,next:NextFunction) => userController.getUserFollowingListById(req,res,next)
    )
    router.get("/me-blocked-list",
        (req:Request,res:Response,next:NextFunction) => userController.getMyBlockList(req,res,next)
    )
    router.patch("/follow-user/:id",
        (req:Request,res:Response,next:NextFunction) => userController.followUserById(req,res,next)
    )
    router.patch("/block-user/:id",
        (req:Request,res:Response,next:NextFunction) => userController.blockUserById(req,res,next)
    ) 
    router.get("/checkUserExists/:name",
        (req:Request,res:Response,next:NextFunction) => userController.checkUserExist(req,res,next)
    )
    router.get("/search",
        (req:Request,res:Response,next:NextFunction) => userController.checkUserExist(req,res,next)
    )
    return router
};