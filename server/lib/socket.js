
// Socket Server - assumed user has JWT Token

import {auth} from './user.js';
import {RedisList} from './redis.js';

const redisLists = new RedisList();

export class SocketServer {

    constructor(io, routes = {}, stores = {
        'users': auth,
        'chat': redisLists,
    }) {

        io.on('connection', socket => {
            this.connect(socket, routes, stores);
        });

    }

    connect(socket, routes, stores) {

        let {id} = socket;

        let subscriptions = [];
        let user;

        socket.on('login', async data => {
            console.log(`login: ${id}`);
            let {username, password} = data;
            let res = await auth.login(id, username, password);
            if(res && !res.error) {
                user = res;
            }
            socket.emit('login', res);
        });

        socket.on('logout', () => {
            console.log(`logout: ${id}`);
            auth.logout(id);
            user = false;
            subscriptions.forEach(unsub => unsub());
            socket.emit('logout');
        });

        socket.on('disconnect', () => {
            console.log(`disconnect: ${id}`);
            auth.logout(id);
            user = false;
            subscriptions.forEach(unsub => unsub());
        });

        socket.on('update', data => {
            if(user && user.username) {
                auth.update(user.username, data);
            } else {
                console.log(`failed update`);
            }
        })

        socket.on('secret', data => {
            console.log(`secret`, data);
            if(user) {
                console.log(`got user. secret ok`);
            } else {
                console.log(`no user`);
            }
        });


        socket.on('subscribe', ({id, location}) => {
            if(id) {
                if(stores[location]) {
                    subscriptions.push(stores[location].subscribe(id, location, data => {
                        if(user) {
                            socket.emit(location, data);
                        }
                    }));

                } else {
                    console.log(`invalid store ${location}`);
                }
                // if(location === 'users') {
                //     subscriptions.push(auth.subscribe(id, 'users', data => {
                //         if(user) {
                //             socket.emit('users', data);
                //         }
                //     }));
                // } else if(location === 'chat') {
                //     subscriptions.push(redisLists.subscribe(id, 'chat', data => {
                //         if(user) {
                //             socket.emit('chat', data);
                //         }
                //     }))
                // }
            } else {
                console.log(`cannot subscribe noid ${id}`);
            }
        });

        socket.on('chat', ({message, timestamp, username}) => {
            if(user && message && username && timestamp) {
                redisLists.add('chat', {message, timestamp, username})
            } else {
                console.log('badchat');
            }
        });

        socket.on('clearchat', () => {
            if(user) {
                redisLists.clear('chat');
            }
        })

        socket.on('users', () => {
            if(user) {
                socket.emit('users', data);
            }
        });

        socket.on('unsubscribe', ({id, location}) => {
            if(id) {
                let subs = subscriptions.filter(s => s.id === id);
                subs.forEach(s => {
                    try {
                        s()
                    } catch {}
                });
                subscriptions = subscriptions.filter(s => s.id !== id);
            } else {
                console.log(`cannot subscribe`);
            }
        })

        // socket.on('subscribe', data => {
        //     subscriptions.push()
        // })

    }

}