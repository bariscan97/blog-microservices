import {QueryResult} from "pg"
import {pool} from "./connection"
import User from "../entities/User"

export default class Repo {
    
    private readonly pool : any
    
    constructor(){
        this.pool = pool
    }
    
    public async getUserByEmail(email:string) : Promise<QueryResult<User[]>>{
        
            const result =  await this.pool.query("SELECT * FROM users WHERE email = $1",[email])
            const {password,...others} = result.rows[0]
            return others 
       
    }
    public async checkUserExist(name:string) : Promise<QueryResult<User[]>>{
        
            const query = `SELECT * FROM users WHERE name = $1`   
            const result = await this.pool.query(query,[name])
            return result.rows
        
    }
    public async getUserById(me_id:string , user_id:string) : Promise<QueryResult<User>>{
       
            const parameters = [user_id]
            console.log("repo", me_id,user_id)
            if (me_id) parameters.push(me_id)
            const query =  `
            SELECT * FROM users AS u 
            WHERE u.id = $1  ${me_id ? ` AND u.id NOT IN (SELECT b.blocking_id FROM blocking WHERE user_id = $2)` : " "}
            `
            console.log(query)
            const result =  await this.pool.query(query,parameters)
            return result.rows 
        
    }
    public async createUser(userDto:Partial<User>) : Promise<QueryResult>{
        
            const keys ="(" + Object.keys(userDto).join(" , ") + ")"
            const values = "(" + Array.from({length: Object.keys(userDto).length}, (_,i) =>  "$"+Number(i + 1)).toString() + ")"
            const  query = "INSERT INTO users" + keys + " " + "VALUES" + values
            const result = await this.pool.query(query,[...Object.values(userDto)])
            return result.rowCount  
            
       

    }
    public async updateMe(userDto:Partial<User>,me_id:string) : Promise<QueryResult>{
        
            
            delete userDto["id"]
            delete userDto["password"]
            const keys = Object.keys(userDto)
            let updates = ""
            for(let i = 0 ;i <keys.length;i++){
                updates += keys[i] + "  =  " + "$" + Number(i+1) + `${i === keys.length-1 ? "  " : " , " }`
            }
            const query = "UPDATE users SET " + updates + ", updateAt = NOW() " + "WHERE id = $" + Number(keys.length + 1)
            console.log(query)
            const result = await this.pool.query(query,[...Object.values(userDto),me_id])
            return result.rowCount
            
        
    }
    public async deleteMe(id:string): Promise<QueryResult> {
        
            const query = "DELETE FROM users WHERE id = $1"
            const result = await this.pool.query(query,[id])
            console.log(result)
            return result.rowCount 
        
    }
    public async followUserById(me_id:string , following_id :string):Promise<QueryResult | any>{
        
            
            let query = `
            SELECT * FROM following AS f 
            WHERE f.user_id = $1 AND following_id = $2
            `
            const check = await this.pool.query(query,[me_id,following_id])
            if (check.rows.length > 0){
                query =  `DELETE FROM following
                          WHERE user_id = $1 AND following_id = $2
                         `
                await this.IncreaseFollowersCount(me_id ,following_id, -1) 
            }else{
                query = `INSERT INTO following(user_id,following_id) VALUES($1,$2)`
                await this.IncreaseFollowersCount(me_id ,following_id, 1)
            }
            const result = await this.pool.query(query,[me_id,following_id])
            return {
                    command : result.command,
                    rowCount :  result.rowCount
                    }
        

    }
    public async blockUserById(me_id:string , blocking_id :string) :Promise<QueryResult | any >{
        
        
            let query = `DELETE FROM following
             WHERE (user_id = $1 AND following_id = $2) OR (user_id = $2 AND following_id = $1)
            `    
            
            await this.pool.query(query,[me_id,blocking_id])
            query = ` 
                SELECT * FROM blocking
                WHERE user_id = $1 AND blocking_id = $2

            `
           
            const check = await this.pool.query(query,[me_id,blocking_id])
            
            if (check.rows.length > 0){
                query = `
                    DELETE FROM blocking
                    WHERE user_id = $1 AND blocking_id = $2
                `
                
            }else{
                query = `
                    INSERT INTO blocking(user_id, blocking_id) VALUES($1 , $2)
                `
                
            }
            const result = await this.pool.query(query,[me_id,blocking_id])
            return {
                command : result.command,
                rowCount :  result.rowCount
                }
      
    }
    public async getMyBlockList(me_id:string,page?:string): Promise<QueryResult<User[]>>{
        
            const query = `
                SELECT u.id, u.name,u.pp_url FROM blocking AS b
                LEFT JOIN users AS u
                ON u.id = b.blocking_id
                WHERE b.user_id = $1
                OFFSET 15 LIMIT $2 * 15
                
            `
            const result = await this.pool.query(query,[me_id,page ? page : 0])
            return result.rows
       
    }
    public async getUserFollowersListById(me_id:string, id:string,page?:string): Promise<QueryResult<User[]>>{
        
            let parameters :string[] = [id,page ? page : "0"]
            
            if(me_id) parameters.push(me_id)
            
            let query = `
                SELECT u.id, u.name, u.pp_url FROM following AS f
                INNER JOIN users AS u
                ON u.id = f.user_id
                ${me_id ? `LEFT JOIN (SELECT 
                    CASE
                        WHEN user_id = $3 THEN blocking_id
                        WHEN blocking_id = $3 THEN user_id
                        ELSE NULL
                    END as related
                FROM blocking) as r
                ON r.related = f.following_id`:""}
                WHERE f.following_id = $1 ${me_id ? " AND r.related is NULL" : ""}
                LIMIT 15 
                OFFSET $2 * 15
                `
            
            const result = await this.pool.query(query,parameters)
            
            return result.rows

      
    }
    public async getUserFollowingListById(me_id:string,id:string,page?:string):Promise<QueryResult<User[]>>{
       
 
            let parameters :string[] = [id,page ? page : "0"]
            
            if(me_id) parameters.push(me_id)
            
            let query = `
                SELECT u.id, u.name, u.pp_url FROM following AS f
                INNER JOIN users AS u
                ON u.id = f.following_id
                ${me_id ? `LEFT JOIN (SELECT 
                    CASE
                        WHEN user_id = $3 THEN blocking_id
                        WHEN blocking_id = $3 THEN user_id
                        ELSE NULL
                    END as related
                FROM blocking) as r
                ON r.related = f.following_id`:""}
                WHERE f.user_id = $1 ${me_id ? " AND r.related is NULL" : ""}
                LIMIT 15 
                OFFSET $2 * 15
                `
            
            const result = await this.pool.query(query,parameters)
            
            return result.rows

       
    }
    private async IncreaseFollowersCount(me_id:string, following_id:string,  cnt : number) :Promise<void>{

        let query = `
            UPDATE users u 
                SET following_cnt = following_cnt + $2
            WHERE  id = $1
        `
        await this.pool.query(query,[me_id, cnt])
        query = `
            UPDATE users u 
                SET followers_cnt = followers_cnt + $2
            WHERE  following_id = $1
        `
        await this.pool.query(query,[following_id, cnt])
    }
    public async searchUserByName(name:string) : Promise<QueryResult<User[]>> {
        const query = `
            SELECT name, pp_url FROM users
            WHERE ILIKE '$1%'
        `
        const result = await this.pool.query(query,[name])
        return result.rows
    }
}

