
// Complete store with redis/postgres tables (todo: lists)

import { RedisTable } from "./redis.js";
import { PostgresTable } from "./postgres.js";

/*
    {
        db: 'redis' / 'postgres',
        table: string,
    }
*/

export class Store {

    constructor(stores) {

        let obj = {};

        stores.forEach(store => {
            if(store.db === 'redis') {
                obj[store.table] = new RedisTable();
            } else {
                obj[store.table] = new PostgresTable();
            }
        })

        this.stores = obj;

    }

    get(table, id) {
        if(!this.stores[table]) {
            return {error: 'Table does not exist'}
        }
        if(id === undefined) {
            return this.stores[table].getTable(table);
        }
        return this.stores[table].get(table, id);
    }


}