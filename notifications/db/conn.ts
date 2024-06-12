import mongoose  from "mongoose";
import local from "../configs/configmap"

const connectDatabase = () =>{
    mongoose.connect(local.configs().get("MONGODB_URI"))
    .then(() => {
        console.log("MongoDb Connection Successful");
    }).catch((err) => {
        console.log(err);
        process.exit(1)
    });
}

export default connectDatabase