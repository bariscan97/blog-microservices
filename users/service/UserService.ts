import Repo from "../repo/repo"
import User from  "../entities/User"

class UserService {
    private readonly repo : Repo
    constructor(){
        this.repo = new Repo() 
    }
    public async createUser(data:Partial<User>) {
        return await this.repo.createUser(data)
    }
    public async updateMe(data:Partial<User>, me_id:string): Promise<any>{
        return await this.repo.updateMe(data,me_id)
    }
    public async deleteMe(me_id:string): Promise<any>{
        return await this.repo.deleteMe(me_id)
    }
    public async getUserById(me_id:string ,id:string): Promise<any>{
        return await this.repo.getUserById(me_id,id)
    }
    public async followUserById(me_id:string , following_id :string): Promise<any>{
        
        return await this.repo.followUserById(me_id,following_id)
    }
    public async blockUserById(me_id:string , blocking_id :string): Promise<any>{
        return await this.repo.blockUserById(me_id,blocking_id)
    }
    public async checkUserExist(name:string) :Promise<any>{
        return await this.repo.checkUserExist(name)
    }
    public async getUserFollowingListById(me_id:string,id:string,page?:string) {
        return await this.repo.getUserFollowingListById(me_id,id,page)
    }
    public async getUserFollowersListById(me_id:string,id:string,page?:string) {
        return await this.repo.getUserFollowersListById(me_id,id,page)
    }
    public async getMyBlockList(me_id:string,page?:string) {
        return await this.repo.getMyBlockList(me_id,page)
    }
    public async searchUserByName(name:string){
        return await this.repo.searchUserByName(name)
    }

}

export default  UserService


