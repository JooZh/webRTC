const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const serveIndex = require('serve-index')
const socketIo = require('socket.io')
const log4js = require('log4js')

log4js.configure({
    appenders:{
        file:{
            type:'file',
            filename:'app.log',
            layout:{
                type:'pattern',
                pattern:'%r %p - %m'
            }
        }
    },
    categories:{
        default:{
            appenders:['file'],
            level:'debug'
        }
    }
})

const logger = log4js.getLogger();

const credentials = {
    key: fs.readFileSync('./cert/localhost.key', 'utf8'), 
    cert: fs.readFileSync('./cert/localhost.crt', 'utf8')
};

const app = express();
app.use(serveIndex('./public'));
app.use(express.static('./public'));

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const PORT = 80;
const SSLPORT = 443;

httpServer.listen(PORT, ()=> {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});

const io = socketIo.listen(httpsServer)

io.sockets.on('connection',(socket)=>{

    socket.on('join',(room)=>{
        socket.join(room);
        
        // console.log(io.sockets.adapter.rooms,room)
        const myRoom = io.sockets.adapter.rooms[room];
        const users = Object.keys(myRoom.sockets).length;
        console.log(myRoom)
        
        logger.log('the number of user in room is:' + users)
        socket.emit('joined',room, socket.id)
        // socket.to(room).emit('joined',room,socket.id)  // 除自己之外
        // socket.broadcast.emit('joined',room, socket.id)  // 除自己之外，站点全部
        // io.in(room).emit('joined',room, socket.id)  // 房间内所以人
    })
    socket.on('message', (room,data)=>{
        
        // socket.to(room).emit('message',room,data)  // 除自己之外
        io.in(room).emit('message',room, data)  // 房间内所以人
        // socket.emit('message',room, data)  // 除自己之外，站点全部
        // socket.broadcast.emit('message',room, data)  // 除自己之外，站点全部
    })
    socket.on('leave',(room)=>{
        const myRoom = io.sockets.adapter.rooms[room];
        const users = Object.keys(myRoom.sockets).length;
        logger.log('the number of user in room is:' + users - 1)

        socket.leave(room);
        // socket.emit('joined',room,socket.id)
        // socket.to(room).emit('joined',room,socket.id)  // 除自己之外
        socket.broadcast.emit('joined',room,socket.id)  // 除自己之外，站点全部
        // io.in(room).emit('joined',room,socket.id)  // 房间内所以人
    })
})
httpsServer.listen(SSLPORT, ()=> {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});
