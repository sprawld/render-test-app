
import Redis from "ioredis";

const { REDIS_URL = `localhost:6379` } = process.env;


export const db = new Redis(REDIS_URL);


export async function db_get(name, key) {
    let exists = await db.hexists(name, key);
    if(!exists) {
        return {error: `${name}/${key} not found`}
    }
    try {
        let data = await db.hget(name, key);
        return JSON.parse(data);
    } catch(e) {
        console.error(e);
        return {error: `${name}/${key} parsing error`};
    }

}


export async function db_set(name, key, data = {}) {

    await db.hset(name, key, JSON.stringify(data));

}


export class RedisSet {

    constructor(name) {
        this.name = name;
    }

    async get(key) {
        let exists = await db.hexists(this.name, key);
        if(!exists) {
            return false;
        }
        try {
            let data = await db.hget(this.name, key);
            return JSON.parse(data);
        } catch(e) {
            console.error(e);
            return false;
        }    
    }

    async update(key, iter) {
        let data = await this.get(key);
        if(!data) {
            return false;
        }
        await this.put(key, iter(data));
        return true;
    }

    async put(key, data) {
        await db.hset(this.name, key, JSON.stringify(data));
    }

    async remove(key) {
        await db.hdel(this.name, key);
    }

    async listKeys() {
        return db.hkeys(this.name);
    }

}



export class RedisStore {

    constructor() {
        this.subscriptions = [];
    }

    async get(name, key) {
        let exists = await db.hexists(name, key);
        if(!exists) {
            return false;
        }
        try {
            let data = await db.hget(name, key);
            return JSON.parse(data);
        } catch(e) {
            console.error(e);
            return false;
        }    
    }

    async update(name, key, iter) {
        let data = await this.get(name, key);
        if(!data) {
            return false;
        }
        await this.put(name, key, iter(data));
        return true;
    }

    async put(name, key, data) {
        await db.hset(name, key, JSON.stringify(data));
        this.event(name, key);
    }

    async remove(name, key) {
        await db.hdel(name, key);
        this.event(name, key);
    }

    event(name, key) {
        this.subscriptions
            .filter(s => s.name === name && s.key === key)
            .forEach(async ({iter}) => {
                let data = await this.get(name, key);
                iter(data);
            });
    }

    subscribe(name, key, iter) {

        let obj = {name, key, iter};
        this.subscriptions.push(obj);
        this.get(name, key).then(res => iter(res));

        return () => {
            console.log(`removing subscription ${name}/${key}`);
            this.subscriptions = this.subscriptions.filter(s => s !== obj);
        }
    }

}