import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import local from "../config/congifMap"
import CustomError from "../utils/CustomErorr"

const Local = local.configs()

const Auth = (req: Request, res: Response, next: NextFunction): any => {
  try{
    
    if (!req.headers.authorization) {
      
        if (req.method !== "GET") return res.status(401).send("unauthorized");
        
        const prefixUrl = req.url.split("/")
        
        if (prefixUrl[prefixUrl.length - 1].startsWith("me")) return res.status(401).send("unauthorized");
        
        req.user = null
        
        next()
    
    }
    
    const secretKey : string = Local.get("JWT_SECRET_KEY") || "secret";
    
    const token : string = req.headers.authorization.split(" ")[1];
    
    if (!token) {
      return next(new CustomError("Missing token"))
    }
    const credential: any = jwt.verify(token, secretKey);
    
    delete credential.password
    
    req.user = credential;
    
    next();
  
  }catch(err){
    
    return new CustomError(err.message)
  
  }
};

export default Auth