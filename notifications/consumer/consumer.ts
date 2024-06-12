import { Connection, connect, Channel,Replies,Options} from 'amqplib'
import Notification from "../model/notification"
import mongoose from "mongoose"


export default async function Consumer() : Promise<void> {

    try{
        const conn : Connection  = await connect("amqp://localhost")
        const channel : Channel = await conn.createChannel()
        const exchangename = 'notification';

        const e : Replies.AssertExchange = await channel.assertExchange(exchangename, 'fanout', {durable: false})
        const q : Replies.AssertQueue =  await channel.assertQueue("api_side_notification")
        
        const c = await channel.bindQueue(q.queue,e.exchange,"")
       
        channel.consume(q.queue , async(msg : any)=>{
            const message : any = JSON.parse(msg.content.toString()) 
            const {type, acess,from,to} = message
            for (let i of to){
                let content:string = ""
               
                if (type === "new_post"){
                    content = `${from} tagged you`
                    
                }else if(type === "like_post"){
                    content = `${from} like you post`
                }
                let noti = new Notification({
                    user_name : to,
                    content : content,
                    target : `http//:localhost:3000/posts/${acess}`,
                    from: from,
                    unread:true
                })   
                await noti.save() 
            }

            },{noAck:true})    
        
    }catch(err){
        if(err instanceof mongoose.Error){
            console.error(err.message)
        }else{
            console.error(err.message || "something wrong")
            process.exit(1)            
        }
    }
} 

