import express, {Application} from 'express';
import apiRouter from "../routes/routes"
import errorHandler from "../middleware/ErorrHandler"
import local from "../configs/configmap"

class Express {
    /**
     * Create the express object
     */
    public static express: Application;

    /**
     * Registering API Routes
     */
    private static mountRoutes(){
        this.express.use(apiRouter())
    };


    
    private static mountErrorHandler(){
        this.express.use(errorHandler);
    };

    /**
     * Starting Server
     */
    public static init() {
        this.express = express()
        this.mountRoutes()
        this.mountErrorHandler()
        this.express.listen(local.configs().get("PORT"))
    };
}

export default Express