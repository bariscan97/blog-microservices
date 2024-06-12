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
                    <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Email Verification</title>
                        </head>
                        <body>
                            <div style="background-color: #f4f4f4; padding: 20px;">
                                <h2>Email Verification</h2>
                                <p>To verify your account, please click the link below:</p>
                                <a href="${target}">Verify My Account</a>
                                <p>If the link doesn't work, you can copy and paste the following address into your browser's address bar:</p>
                                <p>https://www.example.com/verify?token=abcdefg123456</p>
                                <p>Thank you,<br> Your Website Name</p>
                            </div>
                        </body>
                        </html>
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
