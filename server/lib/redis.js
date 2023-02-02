

import Redis from "ioredis";

const { REDIS_URL = `localhost:6379` } = process.env;


export const db = new Redis(REDIS_URL);


export class RedisTable {

    constructor() {
        this.subscriptions = [];
    }

    async get(table, key) {
        if(!key) {
            return this.getTable(table);
        }
        let exists = await db.hexists(table, key);
        if(!exists) {
            return false;
        }
        try {
            let data = await db.hget(table, key);
            return JSON.parse(data);
        } catch(e) {
            console.error(e);
            return false;
        }    
    }

    async put(table, key, data) {
        await db.hset(table, key, JSON.stringify(data));
        this.event(table, key);
    }

    async remove(table, key) {
        await db.hdel(table, key);
        this.event(table, key);
    }

    async listKeys(table) {
        return db.hkeys(table);
    }

    async getTable(table) {
        let exists = await db.hexists(table, key);
        if(!exists) {
            return false;
        }
        return db.hgetall(table);
    }

    async removeTable(table) {
        await db.del(table);
        this.event(table);
    }

    event(table, key) {
        console.log(`non-store redis event ${table}/${key}`);
    }    
    
}


export class RedisTableStore extends RedisTable {

    event(table, key) {

        this.subscriptions
            .filter(s => s.table === table && (!key || key === s.key))
            .forEach(async s => {
                let data = await this.get(table, key);
                s.iterator(data);
            });

    }

    subscribe(id, table, key, iterator) {
        let sub = {id, table, key, iterator};
        this.subscriptions.push(sub);
        this.get(table, key).then(iterator);
        return () => {
            this.subscriptions = this.subscriptions.filter(s => s.id !== id);
        }
    }

    unsubscribe(id) {
        this.subscriptions = this.subscriptions.filter(s => s.id !== id);
    }

}

export class RedisList {

    constructor() {
        this.subscriptions = [];
    }

    async get(table, start = 0, end = -1) {

        let data = await db.lrange(table, start, end);
        return (data || []).map(JSON.parse);
    
    }

    async add(table, data) {
        await db.lpush(table, [JSON.stringify(data)]);
        let index = await db.llen(table);
        this.event(table);
    }

    async clear(table) {
        await db.del(table);
        this.event(table);
    }

    async event(table) {

        let data = await this.get(table);
        this.subscriptions
            .filter(s => s.table === table)
            .forEach(sub => {
                sub.iterator(data);
            })
    }

    subscribe(id, table, iterator) {
        this.subscriptions.push({id, table, iterator});
        this.get(table).then(iterator);
        return () => {
            this.unsubscribe(id);
        }
    }

    unsubscribe(id) {
        this.subscriptions = this.subscriptions.filter(x => x.id !== id);
    }

}