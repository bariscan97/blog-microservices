import App from "./api/app"
import tablesInit from "./init_table"

(async () => {
    await tablesInit()
    /**
     * Load Configuration
     */
    App.loadConfiguration();

    /**
     * Run the Server on Clusters
     */
    App.loadServer();
})()