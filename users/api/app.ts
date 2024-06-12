import dotenv from "dotenv";
import Express from "./Express";
import * as path from "path";

class App {
    public loadConfiguration() {
        dotenv.config({path: path.join(__dirname, '../.env')});
    }

    public loadServer() {
        Express.init()
    }
}

export default new App