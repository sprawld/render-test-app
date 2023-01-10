

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

    let { auth = {}, plain = {} } = obj;

    io.on('connection', socket => {

        console.log('A user connected');

        let state = {};
        Object.keys(plain).forEach(name => {
            socket.on(name, data => plain[name](data, socket, state))
        });

        Object.keys(auth).forEach(name => {
            socket.on(name, data => {
                if(!state.user) {
                    console.log(`error: user not logged in`);
                }
                auth[name](data, state.user, socket, state);
            });
        })
    
        //Whenever someone disconnects this piece of code executed
        socket.on('disconnect', function () {
            console.log('A user disconnected');
        });

    });




    // io.on('connection', socket => {
    //     console.log('A user connected');
    //     let state = {};
    //     Object.keys(obj).forEach(name => {
    //         socket.on(name, data => obj[name](data, socket, state))
    //     });
    // })


}