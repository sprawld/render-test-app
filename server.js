
import express from "express";

import { createServer } from "http";
import { Server } from "socket.io";

import {autoroute, socketroute} from './server/autoroute.js';
import { add_chat, get_chat, clear_chat } from "./server/chat.js";
import {db} from './server/redis.js'
import {create_user, login_user, get_user, update_user} from './server/user.js';

const { PORT = 3001 } = process.env;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json())
app.use(express.static('public'));

autoroute(app, {
    get: {
        '/gettxt': () => {
            return db.get('current').then(txt => ({txt}));
        },
        
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
            if(res.username && !res.error) {
                state.user = res.username;
                let chat = await get_chat();
                socket.emit('chat-set', chat);
            }
            socket.emit('login', res);
        },

        'logout': (_data, _socket, state) => {
            state.user = false;
        },
    },

    auth: {
    
        'update': async (data, user) => {
            return update_user(user, data);
        },
    
        'chat': async (msg, user) => {
            console.log(`chat ${msg}`);
            if(user) {
                add_chat(user, msg)
                io.emit('chat-add', {user, msg});
            }
        },

        'clearchat': () => {
            clear_chat();
            io.emit('chat-set', []);
        }
    }
})



// //Whenever someone connects this gets executed
// io.on('connection', function(socket) {

//     let user;
//     console.log('A user connected');
 
//     socket.on('create', async ({username, password, data = {}}) => {
//         let res = await create_user(username, password, data);
//         if(res.username && !res.error) {
//             user = res.username;
//         }
//         socket.emit('login', res);
//     });

//     socket.on('login', async ({username, password}) => {
//         let res = await get_user(username, password);
//         if(res.username && !res.error) {
//             user = res.username;
//         }
//         socket.emit('login', res);
//     });

//     socket.on('update', async (data) => {
//         if(!user) {
//             socket.emit('login', {error: 'User Not Logged In'});
//         } else {
//             update_user(user, data);
//         }
//     });

//     socket.on('chat', async msg => {
//         console.log(`chat ${msg}`);
//         if(user) {
//             io.emit('chat', [{user, msg}]);
//         }
//     });
 
//     //Whenever someone disconnects this piece of code executed
//     socket.on('disconnect', function () {
//        console.log('A user disconnected');
//     });
//  });
 