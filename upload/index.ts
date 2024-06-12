import express,{Response,Request,NextFunction} from 'express';
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import dotenv from "dotenv"
import * as path from "path"




dotenv.config({path: path.join(__dirname, '../.env')});


const app = express()

app.use(express.json());
 
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
const storage = multer.diskStorage({
  filename: function (req,file,cb) {
    
    cb(null, file.originalname)
  }
});

const uploadMiddleware = (req:Request, res:Response, next:NextFunction) => {
  
  upload.array('files')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    
    const files :any = req.files;
    const errors = [];

    
    files.forEach((file:any) => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    
    if (errors.length > 0) {
      
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }

    
    req.files = files;

   
    next();
  });
};
const upload = multer({storage: storage});

app.post("/upload", uploadMiddleware, async (req,res)=>{
    try{
        const {type} = req.query
    
        const {files} : any = req
        
        const multiFiles : any[] = []
        
        for (let i = 0 ; i < files.length ; i++ ){
            multiFiles.push((await cloudinary.uploader.upload(files[i].path)).url)
        }
        
        return res.json({
          result : type === "multi" ? multiFiles : multiFiles[0]
        })
    
  }catch(err){
      
      return res.json({
        error : err.message || "something wrong"
      })
   
    }
})


app.listen(process.env.PORT || 8010)


 







