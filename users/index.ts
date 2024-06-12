import App from "./api/app"
import local from "./config/congifMap"
import tableInit from "./table_init"


(async () => {
    const a = local.configs()
    await tableInit()
    /**
     * Load Configuration
     */
    App.loadConfiguration();

    /**
     * Run the Server on Clusters
     */
    App.loadServer();
})()