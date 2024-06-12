import express, {Application} from 'express';
import routes from "../routes/routes"
import Auth from "../middleware/Auth"
import errorMiddleware from "../middleware/ErorrHandler"
import local from "../config/congifMap"

class Express {
    /**
     * Create the express object
     */
    public static express: Application;

    /**
     * Registering API Routes
     */
    private static mountRoutes = () => {
        this.express.use("/",routes)
    };


    /**
     * Registering Exception / Error Handlers
     */
    private static mountErrorHandler = () => {
        this.express.use(errorMiddleware);
    };

    /**
     * Registering App Middlewares
     */
    private static mountMiddlewares = () => {
        this.express.use(express.json())
        this.express.use(Auth)
    };

    /**
     * Starting Server
     */
    public static init() {
        this.express = express();

        this.mountMiddlewares();
        this.mountRoutes();
        this.mountErrorHandler();
      

        this.express.listen(local.configs().get("API_PORT"))
    };
}

export default Express