"use strict";
const keygen = require("keygenerator");

function generateUniqueId(db) {
    let selectedKey = keygen.number();

    db.hgetall('article', (err, obj) =>{
        if(err){
            reply({message:'error', error:err});
        }
        if(!obj){
            selectedKey = generateUniqueId(db)
        }
    });
    return selectedKey
}

let routes = function (server, db) {

    server.route({
        method: "POST",
        path: "/",
        handler: (request, reply) => {
            let {title, description, category} = request.payload;
            let key = generateUniqueId(db)

            db.hmset(key, [
                'title', title,
                'description', description,
                'category', category
            ], (err, resp) => {
                if(err){
                    reply({message:'error', error:err});
                }
                reply({message:'success', response:resp, key:key});
            });
        }
    });

    server.route({
        method: "GET",
        path: "/",
        handler: (request, reply) => {
            db.KEYS('*', (err, resp) => {
                if (err) {
                    reply({message: 'error', error: err});
                }
                reply(resp);
            });
        }
    });

    server.route({
        method: "GET",
        path: "/{id}",
        handler: (request, reply) => {
            let id = request.params.id;

            db.hgetall(id, (err, obj) =>{
                if(err){
                    reply({message:'error', error:err});
                }
                if(!obj){
                    reply({message:'unknown article'});
                }
                else {
                    reply(obj)
                }
            });
        }
    });

    server.route({
        method: "PUT",
        path: "/{id}",
        handler: (request, reply) => {
            let id = request.params.id;
            let {title, description, category} = request.payload;

            db.hgetall(id, (err, obj) =>{
                if(err){
                    reply({message:'error', error:err});
                }
                if(!obj){
                    reply({message:'unknown article'});
                }
                if (title) {
                    obj.title = title;
                }
                if (description) {
                    obj.description = description;
                }
                if (category) {
                    obj.category = category;
                }

                db.hmset(id, [
                    'title', obj.title,
                    'description', obj.description,
                    'category', obj.category
                ], (err, resp) => {
                    if(err){
                        reply({message:'error', error:err});
                    }
                    else{
                        reply({message:'success', response:resp, key:id});
                    }
                })
            });
        }
    });

    server.route({
        method: "DELETE",
        path: "/{id}",
        handler: (request, reply) => {
            let id = request.params.id;

            db.del(id, (err, obj) =>{
                if(err){
                    reply({message:'error', error:err});
                }
                if(!obj){
                    reply({message:'unknown article'});
                }
                else {
                    reply({message:'success', response:obj})
                }
            })
        }
    });
}

module.exports = routes;
