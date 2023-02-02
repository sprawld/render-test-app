


// autoroute HTTP routes object (method + express path)

export function autoroute(app, obj) {

    ['get','post','put','delete'].forEach(method => {

        Object.keys(obj[method] || {}).forEach(path => {

            app[method](path, async (req, res) => {
                try {
                    console.log(`call ${method}/${path}`)
                    let data = await obj[method][path](req);
                    res.send(data);
                } catch(e) {
                    console.error(e);
                    res.status(500, e.message);
                }
            })

        })
    });       

}
