import Express from "../app/express"
import connectDatabase from "../db/conn"
import Consumer from "../consumer/consumer"
import dotenv from "dotenv"
import * as path from "path"

class App {
    
    public loadConfiguration() {
        dotenv.config({path: path.join(__dirname, '../.env')});
    }
    public async LoadMessageWorker(){
        await Consumer()
    }
    public loadDB() {
        connectDatabase()
    }

    public loadServer() {
        Express.init()
    }
}

export default new App