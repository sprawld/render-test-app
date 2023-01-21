

// autoroute HTTP routes object (method + express path)

export function autoroute(app, obj) {

    ['get','post','put','delete'].forEach(method => {

        Object.keys(obj[method] || {}).forEach(path => {

            app[method](path, async (req, res) => {
                try {
                    let data = await obj[method][path](req);
                    res.send(data);
                } catch(e) {
                    res.status(500, e.message);
                }
            })

        })
    });       

}


// autoroute socket (auth/plain + socket name)

export function socketroute(io, obj) {

    let userlist = [];

    let { auth = {}, plain = {} } = obj;

    io.on('connection', socket => {

        userlist.push(socket);
        console.log(`A user connected. ${userlist.length} users logged on`);

        let state = {
            unsubscribe: []
        };
        Object.keys(plain).forEach(name => {
            socket.on(name, async data => {
                let res = await plain[name](data, socket, state);
                if(res) {
                    socket.emit(name, res);
                }
            })
        });

        Object.keys(auth).forEach(name => {
            socket.on(name, async data => {
                if(!state.user) {
                    console.log(`error: user not logged in`);
                } else {
                    let res = await auth[name](data, state.user, socket, state);
                    if(res) {
                        socket.emit(name, res);
                    }
                }
            });
        })
    
        //Whenever someone disconnects this piece of code executed
        socket.on('disconnect', function () {
            userlist = userlist.filter(u => u !== socket);
            state.unsubscribe.forEach(u => {
                try {
                    u();
                } catch {}
            });
            console.log(`user disconnected ${userlist.length} users logged on`);
        });

    });

}



export class SocketServer {
    
    constructor({app, io, plain = {}, auth = {}}) {

        this.app = app;
        this.io = io;
        this.users = {};
        this.sockets = {};
        this.plain = plain;
        this.auth = auth;

        io.on('connection', socket => {
            this.add(socket);
        });
    }

    add(socket) {

        this.sockets[socket.id] = socket;
        console.log(`A socket connected. ${Object.keys(this.sockets).length} sockets logged on`);

        let state = {
            unsubscribe: []
        };
        Object.keys(this.plain).forEach(name => {
            socket.on(name, async data => {
                let res = await this.plain[name](data, socket, state);
                if(res) {
                    socket.emit(name, res);
                }
            })
        });

        Object.keys(this.auth).forEach(name => {
            socket.on(name, async data => {
                if(!state.user) {
                    console.log(`error: user not logged in`);
                } else {
                    let res = await this.auth[name](data, state.user, socket, state);
                    if(res) {
                        socket.emit(name, res);
                    }
                }
            });
        })
    
        //Whenever someone disconnects this piece of code executed
        socket.on('disconnect', function () {
            delete this.sockets[socket.id];
            state.unsubscribe.forEach(u => {
                try {
                    u();
                } catch {}
            });
            console.log(`user disconnected ${userlist.length} users logged on`);
        });


    }


}