import express, {Application} from 'express';
import routes from "../routes/routes"
import Auth from "../middleware/Auth"
import errorMiddleware from "../middleware/ErorrHandler"
import local from "../config/congifMap"

const Local = local.configs()

class Express {
    /**
     * Create the express object
     */
    public static express: Application;

    /**
     * Registering API Routes
     */
    private static mountRoutes = () => {
        Express.express.use("/",routes())
    };


    /**
     * Registering Exception / Error Handlers
     */
    private static mountErrorHandler = () => {
        Express.express.use(errorMiddleware);
    };

    /**
     * Registering App Middlewares
     */
    private static mountMiddlewares = () => {
        Express.express.use(express.json())
        // Express.express.use(Auth)
    };

    /**
     * Starting Server
     */
    public static init() {
        Express.express = express();
        
        Express.mountMiddlewares();
        Express.mountRoutes();
        
        Express.mountErrorHandler();
      

        Express.express.listen(Local.get("PORT"))
    };
}

export default Express