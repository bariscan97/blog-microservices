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

async function tables(){
   
          await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
              id SERIAL PRIMARY KEY, 
              name VARCHAR (50) UNIQUE NOT NULL, 
              password VARCHAR (50) NOT NULL, 
              email VARCHAR (255) UNIQUE NOT NULL,
              pp_url TEXT,
              following_cnt INT DEFULT 0 ,
              followers_cnt INT DEFULT 0 
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );    
          `)
         await pool.query(`
            CREATE TABLE IF NOT EXISTS following(
              id SERIAL PRIMARY KEY, 
              user_id INT NOT NULL,
              following_id INT NOT NULL,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ,
              FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
            ) 
          `)
          await pool.query(`
            CREATE TABLE IF NOT EXISTS blocking(
              id SERIAL PRIMARY KEY, 
              user_id INT NOT NULL,
              blocking_id INT NOT NULL,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ,
              FOREIGN KEY (blocking_id) REFERENCES users(id) ON DELETE CASCADE
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


