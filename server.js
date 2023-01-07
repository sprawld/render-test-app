
import express from "express";

import {autoroute} from './server/autoroute.js';
import {db} from './server/redis.js'
import {create_user, get_user} from './server/user.js';


const { PORT = 3001 } = process.env;

const app = express();

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


app.listen(PORT, () => console.log(`listening on port http://localhost:${PORT}`));
