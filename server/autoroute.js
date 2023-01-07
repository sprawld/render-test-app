
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

