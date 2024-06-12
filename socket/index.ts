import * as http from 'http';
import { Server } from 'socket.io';
import jwt from "jsonwebtoken"
import Users from "./redis/onliceUsers"
import axios from 'axios';
import dotenv from "dotenv"


dotenv.config()
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!');
});
const PORT = process.env.PORT || 8006
const io = new Server(server, {
  cors: {
    origin: '*', 
  },
});
io.use((socket , next)=>{
  const {token} = socket.handshake.query
  if (token){
    const userCredential = jwt.verify(token as string , process.env.JWT_SECRET_KEY,
      async(err :jwt.VerifyErrors , decoded : string | jwt.JwtPayload) =>{
        if(err){
          next(new Error("Invalid token"))
        }
        await Users.joinUser(decoded["name"] as string,socket.id)
        socket.data.user = decoded
        next()
    })
  }
  
})

io.on('connection', async(socket) => {
  
  const {name} = socket.data.user
  
  const unreadCount = await axios.get(`http://localhost:8008/${name}?count=true`)
  .then((response) => {
    io.to(socket.id).emit("private",response.data)
  }).catch((error) => {
    console.error(error)
  })
  
  socket.on('disconnect', async() => {
      await Users.leftUser(name)
      console.log(`${name} disconnected`)
  });
  
  socket.on('new-event', async() => {
    io.emit("app",socket.data.message)
  });
 
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
