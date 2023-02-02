
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";


import {auth, createUser, loginUser, verifyUser} from './server/lib/user.js';
import {SocketServer} from './server/lib/socket.js';
import {autoroute} from './server/lib/router.js'

const { PORT = 3001 } = process.env;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json())
app.use(express.static('public'));


const router = autoroute(app, {
    get: {
        '/hello': () => 'hello world',
    },

    post: {
        '/create': async (req) => {
            let {username, password, data} = req.body || {};
            return createUser(username, password, data);
        },
        '/login': (req) => {
            let {username, password} = req.body || {};
            return loginUser(username, password);
        },
        '/verify': async (req) => {
            return verifyUser(req.body && req.body.token);
        }
    },
});

const sockets = new SocketServer(io);


httpServer.listen(PORT, () => console.log(`listening on port http://localhost:${PORT}`));
