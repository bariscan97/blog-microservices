import dotenv from "dotenv";
import * as path from "path";



class Locals{
    
    public configs() : any{
        dotenv.config({path: path.join(__dirname, '../../.env')});
       
        const configMap = new Map<string, any>();
        
        configMap.set("API_PORT",process.env.API_PORT)
        configMap.set("DB_USER",process.env.DB_USER)
        configMap.set("DB_HOST",process.env.DB_HOST)
        configMap.set("DB_NAME",process.env.DB_NAME)
        configMap.set("DB_PASSWORD",process.env.DB_PASSWORD)
        configMap.set("DB_PORT",process.env.DB_PORT)
        configMap.set("JWT_SECRET_KEY",process.env.JWT_SECRET_KEY)
        
        return configMap
    }

}

export default new Locals