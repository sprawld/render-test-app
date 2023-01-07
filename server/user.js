
import bcrypt from 'bcrypt';

import {db} from './redis.js';

// password hashing

export async function check_password(password, hash) {
    console.log(`checking password ${password} / ${hash}`);
    let result = await bcrypt.compare(password, hash);
    return result;
}


export async function hash_password(password) {
    let salt = await bcrypt.genSalt(12);
    let hash = await bcrypt.hash(password, salt);
    console.log(`hashing password ${password} / ${hash} / ${salt}`);
    return hash;
}


export async function get_user(username, password) {

    let exists = await db.hexists('users', username);
    if(!exists) {
        return {error: 'User Not Found'}
    }
    let userjson = await db.hget('users', username);
    let user = JSON.parse(userjson);

    let correct = await check_password(password, user.hash);
    if(!correct) {
        return {error: 'Password Incorrect'}
    }

    return user;

}

export async function create_user(username, password, data = {}) {

    let exists = await db.hexists('users', username);
    if(exists) {
        return {error: 'User Already Exists'}
    }

    let hash = await hash_password(password);

    await db.hset('users', username, JSON.stringify({username, hash, data}));

    return {username};

}

export async function update_user(username, password, data = {}) {

    let res = await get_user(username, password);
    if(res.error) {
        return res;
    }
    res.data = data;

    await db.hset('users', username, JSON.stringify(res));

    return res;

}
