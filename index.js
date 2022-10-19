const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require("http");

const server = http.createServer();
server.listen(webSocketsServerPort)
console.log('listening on port ' + webSocketsServerPort)

const wsServer = new webSocketServer({
    httpServer: server
})

const clients = {};

const getUniqueId = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
}

wsServer.on('request', function(request) {
    const userId = getUniqueId();
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');

    const connection = request.accept(null, request.origin);
    clients[userId] = connection;
    console.log('connected: ' + userId + 'in ' + Object.getOwnPropertyNames(clients))

    connection.on('message', function(message) {
        for (let key in clients) {
            if (message.type === 'utf8') {
                clients[key].sendUTF(message.utf8Data);
                console.log('sent Message to: ', clients[key])
            }
        }
    })
})