import Repo from "../repo/repo"
import PostData from "../entities/Post"


class UserService {
    private readonly repo : Repo
    constructor(){
        this.repo = new Repo() 
    }
    public async createPost(me_id:string, data:Partial<PostData>) {
       return await this.repo.createPost(me_id,data)
    }
    public async updatePostById(me_id:string,post_id:string, data:Partial<PostData>): Promise<any>{
        return await this.repo.updatePostById(me_id,post_id,data)
    }
    public async deletePostById(me_id:string, post_id:string): Promise<any>{
        return await this.repo.deletePostById(me_id,post_id)
    }
    public async getPostById(me_id:string, post_id:string): Promise<any>{
        return await this.repo.getPostById(me_id, post_id)
    }
    public async likePostById(me_id:string , post_id :string): Promise<any>{
        
        return await this.repo.likePostById(me_id, post_id)
    }
    public async getPostChildrenById(me_id:string , post_id :string, page:string): Promise<any>{
        return await this.repo.getPostChildrenById(me_id,post_id,page)
    }
    public async getPostsExplore(me_id:string, category:string,page:string) :Promise<any>{
        return await this.repo.getPostsExplore(me_id, category ,page)
    }
   

}

export default  UserService


