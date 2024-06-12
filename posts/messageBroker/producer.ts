import {Rabbitmqservice} from "./BasePublisher"

type Message = {
    type : string,
    acess:string,
    from: string,
    to : string[] | string   
}


export async function Publish(message : Message) : Promise<void> {
    
    const Publisher = new Rabbitmqservice()
    await Publisher.publishInExchange({
        name:"notification",
        type:"fanout",
        options:{durable:true}},
        "",
        JSON.stringify({
        message : message
    }))

} 
