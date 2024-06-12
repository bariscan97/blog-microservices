import redis,{ createClient,RedisClientType } from 'redis';


class Cache{

    public client : RedisClientType 
    
    constructor(){
        this.client = createClient();
        this.client.on('error', (err) => {
          console.error('Redis Client Error', err)
        })
        this.client.connect().catch(console.error)
      }
    
    public async addItem(key:string,value:string){
        await this.client.set(key,value)
    }
    public async getItem(key:string){
        return await this.client.get(key)
    }
    public async removeItem(key:string){
      await this.client.del(key)
    }
    public async setAddToken(token:string){
      await this.client.sAdd("tokens",token)
    }
    public async removeToken(token:string){
      await this.client.sRem("tokens",token)
    }
    public async checkTokenExists (token:string){
      return this.client.sIsMember("tokens",token)
    }
  
}

export default new Cache