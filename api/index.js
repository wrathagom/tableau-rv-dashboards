'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server({
    connections: {
        routes: {
            cors: true
        }
    }
});
server.connection({ 
    port: 8000 
});

const low = require('lowdb')
const shortid = require('shortid')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('/usr/src/data/db.json')
const db = low(adapter)
// Set some defaults
db.defaults({ sets: [] })
.write()

// Add the route
server.route({
    method: 'GET',
    path:'/sets', 
    handler: function (request, reply) {
        var sets = db.get('sets').value()

        return reply(sets);
    }
});

// Add the route
server.route({
    method: 'GET',
    path:'/sets/{name}', 
    handler: function (request, reply) {
        var setName = request.params.name
        var set = db.get('sets').find({ name: setName }).value()

        return reply(set);
    }
});

// Add the route
server.route({
    method: 'POST',
    path:'/sets', 
    handler: function (request, reply) {
        var newSet = request.payload
        console.log(newSet)

        db.get('sets').push(newSet).write()

        return reply('Success?');
    }
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});