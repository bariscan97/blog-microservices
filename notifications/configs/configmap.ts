import dotenv from "dotenv"
import * as path from "path"



class Locals{
    
    public configs() : any{
        
        dotenv.config({path: path.join(__dirname, '../../.env')});
       
        const configMap = new Map<string, any>();
        
        configMap.set("RABBITMQ_URI",process.env.RABBITMQ_URI)
       
        configMap.set("MONGODB_URI",process.env.MONGODB_URI)
       
        configMap.set("PORT",process.env.PORT)

        return configMap
    }

}

export default new Locals