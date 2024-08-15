import {QueryResult} from "pg"
import {pool} from "./connection"
import Post from "../entities/Post"






export default class Repo{
    private readonly pool : any
    constructor(){
        this.pool = pool
    }
    public async createPost(me_id:string ,postData:Partial<Post>,parent_id? :string ):Promise<QueryResult>{
    
            const data :any = Object.assign(postData,{userid: me_id, parent_id : parent_id ? parent_id : null})
            const keys ="(" + Object.keys(data).join(" , ") + ")"
            const values = "(" + Array.from({length: Object.keys(data).length}, (_,i) =>  "$"+Number(i + 1)).toString() + ")"
            const  query = "INSERT INTO users" + keys + " " + "VALUES" + values
            const result = await this.pool.query(query,[...Object.values(data)])
            if (parent_id) await this.IncreaseChildrenCnt(parent_id, 1)
            return result.rowCount
        

    }
    public async updatePostById(me_id:string , post_id :string, postData:Partial<Post>):Promise<QueryResult>{
        const data :any = Object.assign(postData, {user_id: me_id})
        const keys = Object.keys(data)
        const size = keys.length
        let updates = ""
        for(let i = 0 ;i <keys.length;i++){
             updates += keys[i] + "  =  " + "$" + Number(i+1) + `${i === keys.length-1 ? "  " : " , " }`
         }
        const query = "UPDATE users SET " + updates + ", updateAt = NOW() " + "WHERE user_id = $" + `${Number(size + 1)} AND id = $` + `${Number(size + 2)}`  
        const result = await this.pool.query(query,[...Object.values(data), me_id , post_id])
        return result.rowCount
    }
    public async deletePostById(me_id:string , post_id : string):Promise<QueryResult | any>{
        const query = `DELETE FROM posts WHERE id = $1 and userid = $2`
        const result = await this.pool.query(query,[post_id, me_id])
        const parent_id = this.getPostParentById(post_id)[0].parent_id
        if (parent_id) await this.IncreaseChildrenCnt(parent_id, -1)
        return {
            command : result.command,
            rowCount : result.rowCount
        }
    }
    public async getPostParentById(post_id :string):Promise<QueryResult>{
        return await this.pool.query(`SELECT parent_id FROM post WHERE id = $1`,[post_id])
    }
    public async getPostById(me_id:string, post_id:string){
        const parameters:string[] = [post_id] 
        let query = `
                SELECT u.img_url as user_img , u.name, p.img_url,p.children_cnt, p.like_cnt FROM post AS p 
                INNER JOIN user AS u
                ON u.id = p.user_id
                WHERE p.id = $1 OR p.acess_token = $1 
                `
        if (me_id){
            query = query + " " +`
            AND p.userid NOT IN (SELECT 
                CASE
                    WHEN user_id = $2 THEN blocking_id
                    WHEN blocking_id = $2 THEN user_id
                    ELSE NULL
                END as related
            FROM blocking) 
            `    
            parameters.push(me_id)
        }
        const result = await this.pool.query(query, parameters)
        return result.rows
    }
    public async getPostChildrenById(me_id:string ,post_id:string, page:string):Promise<QueryResult>{
        const parameters:string[] = [post_id,page ? page : "0"] 
        if (me_id) parameters.push(me_id)
        const query =  `
            SELECT u.name, u.pp_url ,p.content, p.img_url ,p.children_cnt, p.like_cnt FROM posts AS p
            LEFT JOIN users AS u
            ON u.id = p.user_id
            ${me_id ? `LEFT JOIN (SELECT 
                CASE
                    WHEN user_id = $3 THEN blocking_id
                    WHEN blocking_id = $3 THEN user_id
                    ELSE NULL
                END as related
            FROM blocking) AS r
            ON p.user_id = r.related  ` : ""}
            WHERE p.parent_id = $1 ${me_id ? ` AND r.related is NULL`:""}
            LIMIT 15 
            OFFSET $2 * 15
          `
        const result = await this.pool.query(query,parameters)        
        return result.rows
        
    }
    public async likePostById(me_id:string,post_id:string):Promise<QueryResult | any>{
        let query = `
            SELECT * FROM likes
            WHERE user_id = $1 AND post_id = $2
        `
        const check = await this.pool.query(query,[me_id,post_id])
        if (check.rows.length > 0){
            query = `
                DELETE * FROM likes
                WHERE user_id = $1 AND post_id = $2
            `
            await this.declikeCount(post_id, -1)
        }else{
            query = `
                INSERT INTO likes(post_id,user_id) VALUES($1, $2)
            `
            await this.declikeCount(post_id, 1)
        }
        const result = await this.pool.query(query,[me_id, post_id])
        return {
            command : result.command,
            rowCount : result.rowCount
        }
    }
    private async declikeCount(post_id:string,cnt:number)  :Promise<void>{
        const query = `
           UPDATE posts
           SET like_cnt = like_cnt + $1     
        `
        await this.pool.query(query,[post_id, cnt])
    }
    private async IncreaseChildrenCnt(parent_id:string,cnt:number) : Promise<void>{
        const query = `
           UPDATE posts
           SET like_cnt = like_cnt + $1     
        `
        await this.pool.query(query,[parent_id, cnt])
    }
    public async getPostsExplore(me_id:string , category?:string ,page?:string):Promise<QueryResult>{
        const parameters :string[] = [page ? page : "0"]
        let addFilter = ""
        if (category) {
            parameters.push(category)
            addFilter = " p.cat = $2 "
        }
        if (me_id) parameters.push(me_id)
        let query = `
            SELECT u.name, u.pp_url ,p.content, p.img_url ,p.children_cnt, p.like_cnt FROM posts AS p
            LEFT JOIN users AS u
            ON u.id = p.user_id
            ${me_id ? `LEFT JOIN (SELECT 
                CASE
                    WHEN user_id = $3 THEN blocking_id
                    WHEN blocking_id = $3 THEN user_id
                    ELSE NULL
                END as related
            FROM blocking) AS r
            ON p.user_id = r.related  ` : ""}
            ${me_id || category ? "WHERE ": ""} ${addFilter} ${me_id && category ? " AND ":" "} ${me_id ? ` r.related is NULL`:""}
            ORDER BY p.createAt ,p.like_cnt
            LIMIT 15 
            OFFSET $2 * 15
        `
        const result = await this.pool.query(query,parameters)        
        return result.rows
        

    }
   
}

