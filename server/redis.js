
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
