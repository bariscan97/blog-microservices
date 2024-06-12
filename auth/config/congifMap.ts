import dotenv from "dotenv";
import * as path from "path";



class Locals{
    
    public configs() : any{
        
        dotenv.config({path: path.join(__dirname, '../../.env')});
        
        const configMap = new Map<string, any>();
        
        configMap.set("API_PORT",process.env.API_PORT)
        configMap.set("JWT_SECRET_KEY",process.env.JWT_SECRET_KEY)
        configMap.set("JWT_EXPIRE",process.env.JWT_EXPIRE)
        configMap.set("JWT_COOKIE",process.env.JWT_COOKIE)
        configMap.set("NODE_ENV",process.env.NODE_ENV)
        
        return configMap
    
    }

}

export default new Locals