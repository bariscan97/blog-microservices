import  dotenv from "dotenv"
import {Pool}  from 'pg'

dotenv.config()
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD ,
    port: Number(process.env.DB_PORT),
  })

  console.log("hi mom!",process.env.DB_NAME)
async function tables(){
     await pool.query(`
        CREATE TABLE IF NOT EXISTS posts(
          id SERIAL PRIMARY KEY, 
          content TEXT , 
          img_url TEXT , 
          parent_id INT ,
          user_id INT NOT NULL,
          cat varchar(255),
          acess_token INT NOT NULL UNIQUE,
          children_cnt INT DEFAULT 0,
          like_cnt INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );    
      `)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS likes(
          id SERIAL PRIMARY KEY, 
          user_id INT NOT NULL,
          post_id INT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ,
          FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
        ) 
      `)
      
    
}  

async function init(){
  try{
    await tables()
  }catch(err){
    console.error(err.message || "something wrong")
  }finally{
    await pool.end()
  }
}

export default init