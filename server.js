
import express from "express";

import { createServer } from "http";
import { Server } from "socket.io";

import { SocketServer, autoroute, socketroute} from './server/autoroute.js';
import { add_chat, get_chat, clear_chat } from "./server/chat.js";
import {db, RedisStore} from './server/redis.js'
import {list_users, create_user, login_user, get_user, update_user} from './server/user.js';
import { Store, sub_dm, get_dm, send_dm } from './server/messages.js'

const { PORT = 3001 } = process.env;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json())
app.use(express.static('public'));

list_users().then(console.log, console.error);

autoroute(app, {
    get: {
        '/gettxt': () => {
            return db.get('current').then(txt => ({txt}));
        },

        '/userlist': () => list_users(),
        
    },
    
    post: {
        '/settxt': (req) => {
        
            console.log(`req`,req.body);
            let {txt} = req.body;
            console.log(`req ${txt}`, req.body)
            db.set('current', txt);
        
            res.send({});
        },

        '/login': async req => {
            let {username, password} = req.body;
            let res = await get_user(username, password);
            return res;
        },

        '/user/create': async req => {
            let {username, password} = req.body;
            let res = await create_user(username, password);
            return res;
        },
    }

});


httpServer.listen(PORT, () => console.log(`listening on port http://localhost:${PORT}`));



socketroute(io, {
    plain: {
        'create': async ({username, password, data = {}}, socket, state) => {
            let res = await create_user(username, password, data);
            if(res.username && !res.error) {
                state.user = res.username;
            }
            socket.emit('login', res);
        },
    
        'login': async ({username, password}, socket, state) => {
            
            let res = await login_user(username, password);
            console.log(`login ${username}/${password}`, res);
            socket.emit('login', res);
            if(res.username && !res.error) {
                state.user = res;
                state.username = res.username;
                let chat = await get_chat();
                socket.emit('chat-set', chat);
                // let dms = await get_dm(username);
                // socket.emit('dm-set', dms);
            }
        },

        'logout': (_data, _socket, state) => {
            state.user = false;
        },
    },

    auth: {
    
        'update': async (data, {username}) => {
            return update_user(username, data);
        },
    
        'chat': async (msg, {username}) => {
            console.log(`chat ${msg}`);
            if(username) {
                add_chat(username, msg)
                io.emit('chat-add', {user: username, msg});
            }
        },

        'clearchat': () => {
            clear_chat();
            io.emit('chat-set', []);
        },

        // 'subscribe-dm': (_data, {username}, socket) => {
        //     Store.subscribe('dm', )
        // },

        // 'get-dm': async (_data, {username}, socket) => {
        //     let res = await get_dm(username);
        //     socket.emit('dm', res);
        // },

        // 'send-dm': async ({to, msg}, user) => {
        //     await send_dm(user, to, msg);
        // },

        // 'subscribe': ({map}, {username}, socket, state) => {
        //     state.unsubscribe.push(Store.subscribe(map, username, data => {
        //         socket.emit(map, data);
        //     }));
        // },
    }
})

