// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken"

// import CustomError from "../utils/CustomErorr"

// export interface IGetUserAuthInfoRequest extends Request {
//     user: {
//         id:string,
//         name:string,
//         image_url:string
//     }
//   }
// const Auth = (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): any => {
//   try{
//     if (!req.headers.authorization) {
//       if (req.method !== "GET") return res.status(401).send("No token!");
//       const prefixUrl = req.url.split("/")
//       if (prefixUrl[prefixUrl.length - 1].startsWith("me")) return res.status(401).send("No token!");
//       req.user = null
//       next()
//     }
  
//     const secretKey : string = process.env.JWT_SECRET_KEY || "secret";
//     const token : string = req.headers.authorization.split(" ")[1];
//     const credential: any = jwt.verify(token, secretKey);
    
//     if (credential) {
//         return new CustomError("token invalid")
//       }
//     delete credential?.password
//     req.user = credential;
//     return next();
//   }catch(err){
//     return new CustomError(err.message)
//   }
// };

// export default Auth