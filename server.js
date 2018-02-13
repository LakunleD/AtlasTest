'use strict'
const Hapi = require("hapi");
const redis = require("redis");

let server = new Hapi.Server();
let client = redis.createClient();

server.connection({
    "port": 6060
});

client.on('connect', () => {
    console.log('connected to redis');
}

function startServer(server) {
    server.start(function () {
        console.log('Server running at: ' + server.info.uri);
        server.log('info', 'Server running at: ' + server.info.uri);
    });
}

startServer(server);
