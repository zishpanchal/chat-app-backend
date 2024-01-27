const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messagesRoute = require("./routes/messagesRoute");
const Socket  = require("socket.io");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoute);

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("db connection successfully")
    }).catch((err)=>{
        console.log(err.messege)
})

const server = app.listen(process.env.PORT, ()=>{
    console.log(`started server on port ${process.env.PORT}`)
});

const io = Socket(server, {
    cors:{
        origin: "http://localhost:3000",
        credentials: true,
    }
});
global.onlineUsers = new Map();
io.on("connection",(Socket)=>{
    global.chatSocket = Socket;
    Socket.on("add-user", (userId)=>{
        onlineUsers.set(userId, Socket.id);
    });
    Socket.on("send-msg", (data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            Socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    })
} )
