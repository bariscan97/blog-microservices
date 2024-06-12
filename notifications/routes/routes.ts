import {Response,NextFunction,Request ,Router} from "express"
import Notifitacation from "../model/notification"

export default () => {
    const router = Router();

    router.get("/:name",(req:Request,res:Response,next:NextFunction) =>{
        async(req:Request,res:Response,next: NextFunction) =>{
            try{
                const {count ,page} = req.query
                if (count){
                    return res.json({
                        result : await Notifitacation.countDocuments({user_name:req.params.name}).where({unread:true})
                    })
                }
                const notifitacations = await Notifitacation
                .find({name:req.params.name})
                .skip(Number(page) * 10)
                .limit(10)
                
                await Notifitacation.updateMany(
                    {name:req.params.name},{unread : false}
                )
                
                return res.json({
                    result : notifitacations
                })
            }catch(err){
                next(new Error(err.message || "something wrong"))
            }
        }
    })
    
    return router
};