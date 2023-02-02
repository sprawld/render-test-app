
// User Functions: uses crypto.js & postgres.js

import { hashPassword, checkPassword, createToken, verifyToken } from "./crypto.js";
import { PostgresTableStore } from './postgres.js';

export const db = new PostgresTableStore();

export async function createUser(username, password, data = {}) {
    console.log('createUser1');
    let user = await db.get('users', username);
    if(user) {
        return {error: 'User Already Exists'}
    }

    console.log('createUser2');
    let userdata = {username, hash: hashPassword(password)}

    console.log('createUser3');
    await db.put('users', username, userdata);
    console.log('createUser4');
    await db.put('userspublic', username, data);
    
    console.log('createUser5');
    return {username, data};
}

export async function getUser(username) {
    let user = await db.get('users', username);

    console.log(`user ${username}`, user);

    return user || false;

}

export async function loginUser(username, password, extra = {}) {
    
    if(!password) {
        return {error: 'Password required'}
    }

    let user = await getUser(username);

    if(!user) {
        return {error: 'User Not Found'};
    }
    
    let correct = checkPassword(password, user.hash);

    if(!correct) {
        return {error: 'Password Incorrect'}
    }

    let data = await db.get('userspublic', username);

    let token = createToken({...extra, username});

    return {username, data, token};
}


export function verifyUser(token) {

    let payload = verifyToken(token);

    if(payload && !payload.error && payload.exp) {
        const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
        const refresh = payload.exp - nowUnixSeconds < JWT_REFRESH;
        return {...payload, refresh}
    }

    return payload;

}



export function listUsers() {
    return db.get('userspublic');
}

export function updateUser(username, data = {}) {
    return db.put('userspublic', username, data);
}

export async function deleteUser(username) {
    await db.remove('users', username);
    await db.remove('userspublic', username);
}

export async function deleteAllUsers() {
    await db.remove('users');
    await db.remove('userspublic');
}




export class UserAuth {

    constructor() {
        this.subscriptions = [];
        this.users = [];
    }

    async login(id, username, password) {

        let res = await loginUser(username, password, {id});

        if(res && !res.error) {
            let {data} = res;
            this.users = [
                ...this.users.filter(u => u.id !== id),
                {data, username, id}
            ];
            this.event();
        }

        return res;
    }

    logout(id) {
        this.users = this.users.filter(u => u.id !== id);
        this.event();
    }

    verify(token) {
        return verifyToken(token);
    }

    async event() {
        let users = await this.getUsers();
        console.log(`event`, users);
        
        this.subscriptions.forEach(sub => {
            sub.iterator(users);
        });
    }

    async getUsers() {
        let list = await listUsers();
        let obj = {};
        list.forEach(({key, data}) => {
            obj[key] = {...data, username: key};
        });
        return obj;
        // let keys = await listUsers();
        // console.log(`users:`, keys);
        // let data = await Promise.all(keys.map(key => db.get('userspublic', key)));
        // console.log(`userdata:`, data);
        // return data;
    }

    async update(username, data) {
        await updateUser(username, data);
        this.event();
    }

    subscribe(id, table, iterator) {
        if(table !== 'users') {
            console.log(`invalid subscription ${table}`);
            return () => null;
        }
        let sub = {id, iterator};
        this.subscriptions.push(sub);
        this.getUsers().then(iterator);
        console.log(`subscribe`, this.users);
        return () => {
            this.unsubscribe(id);
        }
    }

    unsubscribe(id) {
        this.subscriptions = this.subscriptions.filter(s => s.id !== id);
    }

}

export const auth = new UserAuth();