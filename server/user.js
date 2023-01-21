
import bcrypt from 'bcrypt';
import { create_keys } from './crypto.js';

// import {db, RedisSet} from './redis.js';

import { PostgresStore } from './store.js';

let db = new PostgresStore();
let userdb = db.create('users');
// let userdb = new RedisSet('users');

// password hashing

export async function check_password(password, hash) {
    console.log(`checking password ${password} / ${hash}`);
    if(!hash) {
        console.log(`no hash`);
        return false;
    }
    try {
        let result = await bcrypt.compare(password, hash);
        return result;    
    } catch(e) {
        console.error(e);
        return false;
    }
}


export async function hash_password(password) {
    let salt = await bcrypt.genSalt(12);
    let hash = await bcrypt.hash(password, salt);
    console.log(`hashing password ${password} / ${hash} / ${salt}`);
    return hash;
}


export async function login_user(username, password) {

    if(!password) {
        return {error: 'Password required'}
    }

    let user = await get_user(username);

    if(user.error) {
        return user;
    }

    let correct = await check_password(password, user.hash);
    if(!correct) {
        return {error: 'Password Incorrect'}
    }

    return user;
}

export async function get_user(username) {

    let user = await userdb.get(username);

    console.log(`user ${username}`, user);

    if(!user) {
        return {error: 'User Not Found'};
    }

    return user;

}

export async function create_user(username, password, data = {}) {

    let user = await userdb.get(username)
    if(user) {
        return {error: 'User Already Exists'}
    }

    let hash = await hash_password(password);

    let keys = create_keys();

    await userdb.put(username, {username, hash, keys, data});

    return {username};

}

export async function update_user(username, data = {}) {

    let res = await get_user(username);
    if(res.error) {
        return res;
    }
    res.data = data;

    await userdb.put(username, res);

    return {username};

}


export async function public_key(username) {

    let res = await get_user(username);
    if(res.error) {
        return res;
    }
    return res.key.publicKey;
}

export async function list_users() {

    let list = await userdb.listKeys();

    // let list = await db.hkeys('users');

    return list;
}
