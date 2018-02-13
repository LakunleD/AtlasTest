'use strict'
const Hapi = require("hapi");
const redis = require("redis");
const route= require('./route/route');

let server = new Hapi.Server();
let client = redis.createClient();

server.connection({
    "port": 6060
});

client.on('connect', () => {
    console.log('connected to redis');
    route(server,client);
});

function startServer(server) {
    server.start(function () {
        console.log('Server running at: ' + server.info.uri);
        server.log('info', 'Server running at: ' + server.info.uri);
    });
}

startServer(server);
