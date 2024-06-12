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
    public async getUserSocketId (user:string) : Promise<string>{
        return await this.client.get(`users::${user}`)
    }
    public async joinUser(user:string,clientId:string){
        await this.client.set(`users::${user}`,clientId)
        await this.client.set(`clients::${clientId}` , user)        
    }
    public async leftUser(user:string){
        const clientId : any = await this.getUserSocketId(user)
        await this.client.del(user)
        await this.client.del(clientId)
    }
    
}

export default new Cache