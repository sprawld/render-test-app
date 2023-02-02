
import {refreshToken, createToken, verifyToken} from '../server/jwt.js';

function test() {

    let token = createToken({username: 'test', hello: 'world'})

    console.log(`token`, token);

    console.log(token.split('.').map(str => Buffer.from(str, 'base64').toString()))

    let verify = verifyToken(token)

    console.log(`verify`, verify);

    let refresh = refreshToken(token);

    console.log(`refresh`, refresh);


    let verify2 = verifyToken(token)

    console.log(`verify2`, verify2);

}

test();
