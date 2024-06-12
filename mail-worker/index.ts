import {Connection, connect, Channel, Replies} from 'amqplib'
import mailSender from "./mailSender/mailSender"
import dotenv from "dotenv"
import * as path from "path"


dotenv.config({path: path.join(__dirname, '../.env')});

export async function Worker() : Promise<void> {

    try{
        
        const conn : Connection  = await connect(process.env.RABBITMQ_URI)
        const channel : Channel = await conn.createChannel()
        const exchangename = 'notification';

        // const e : Replies.AssertExchange = await channel.assertExchange(exchangename, 'fanout', {durable: false})
        const q : Replies.AssertQueue =  await channel.assertQueue("email")
        
        // const c = await channel.bindQueue(q.queue,e.exchange,"")
        
                
        channel.consume(q.queue , (msg : any)=>{
            console.log(" [x] %s", JSON.parse(msg.content));
            const message = JSON.parse(msg.content)
            let emailTemplate , target
            if(message.type === "forgotPassword"){
                target = `http://localhost:${3001}/auth/reset-password?resetPasswordToken=${message.token}`
               
                emailTemplate=`
                    <h3>Reset Your Password</h3>
                    <p>This <a href='${target}' target='_blank'>link</a>will expire in 1 hour</p>
                `
            }else{
                target = `http://localhost:${3001}/auth/register-verify?token=${message.token}`;
            
                emailTemplate=`
                    <h3>register verify</h3>
                    <p>This <a href='${target}' target='_blank'>link</a>will expire in 1 hour</p>
                    `
                }
            
            mailSender({
                to : message.to,
                from : process.env.SMTP_USER,
                subject : message.type,
                html : emailTemplate
            })
            
        },{noAck:true})    

    }catch(err){
        throw new Error(err.message)
    }

} 

Worker()
