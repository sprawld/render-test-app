
const express = require("express");
const Redis = require("ioredis");

const { REDIS_URL = `localhost:6379`, PORT = 3001 } = process.env;

const app = express();
const db = new Redis(REDIS_URL);

app.use(express.json())
app.use(express.static('public'));

app.get('/gettxt', (req, res) => {

    db.get('current').then(txt => {
        res.send({txt})
    });
});

app.post('/settxt', (req, res) => {

    console.log(`req`,req.body);
    let {txt} = req.body;
    console.log(`req ${txt}`, req.body)
    db.set('current', txt);

    res.send({});
});



app.listen(PORT, () => console.log(`Example app listening on port http://localhost:${PORT}!`));
