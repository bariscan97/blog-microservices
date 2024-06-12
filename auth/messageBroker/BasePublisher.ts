import { Connection, connect, Channel,Replies,Options} from 'amqplib'

type ExchangeOptions = {
  name : string
  type : string,
  options?: {
    durable:boolean
  }

}
interface RabbitmqService{
  // init : () => Promise<void>
  publichInQueue(queue: string, message: string | any) :Promise<void>
  publishInExchange(
    ExchangeOptions,
    routingKey: string,
    message: string
  ): Promise<void>
}



export class Rabbitmqservice implements RabbitmqService{
    private conn: Connection
    private channel: Channel
    private uri:string = "amqp://localhost"
  
    constructor(){}
  
    private async init(): Promise<void>{
      this.conn = await connect(this.uri)
      this.channel = await this.conn.createChannel()
    }
   
    public async publichInQueue(queue: string, message: string | any) :Promise<void>{
      try{
          await this.init()
          const q:Replies.AssertQueue = await this.channel.assertQueue(queue)
          this.channel.sendToQueue(q.queue, Buffer.from(message))

      }catch(err){

         throw new Error(err)

      }finally{
          await this.channel.close()
          await this.conn.close()
      }
    }
    public async publishInExchange(
      exchangeOptions : ExchangeOptions,
      routingKey: string,
      message: string
    ): Promise<void> {
        try{
            
            await this.init()
          
            const {name, type, options} = exchangeOptions
            
            const e : Replies.AssertExchange = await this.channel.assertExchange(name, type, options)
            
            this.channel.publish(exchangeOptions.name, routingKey, Buffer.from(message))
        
        }catch(err){
          
          throw new Error(err)

        }finally{
          await this.channel.close()
          await this.conn.close()
      }
    }

}



