import App from "./app/app"

(async () => {
    
    App.loadConfiguration()
    
    App.LoadMessageWorker()
    
    App.loadDB()
    
    App.loadServer()

})()