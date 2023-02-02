
// Postgres Functions

// import { get_keys, get_plain, put_plain, remove_plain } from '../jsonplain.js';

import pg from "pg";
const { Client } = pg;

const {
    DB_USER = 'postgres',
    DB_HOST = 'localhost',
    DB_DATABASE = 'postgres',
    DB_PASSWORD = 'mysecretpassword',
    DB_PORT = 5432,
} = process.env;


export async function createClient({
    user = DB_USER,
    host = DB_HOST,
    database = DB_DATABASE,
    password = DB_PASSWORD,
    port = DB_PORT,
} = {}) {
    
    const client = new Client({
        user, host, database,
        password, port,
    });

    await client.connect();

    return client;
}


// JSON keyed by table/key

export class PostgresTable {

    constructor({
        user = DB_USER,
        host = DB_HOST,
        database = DB_DATABASE,
        password = DB_PASSWORD,
        port = DB_PORT,
    } = {}) {
        
        const client = new Client({
            user, host, database,
            password, port,
        });
    
        client.connect();

        this.client = client;
        this.subscriptions = [];
    }

    async query(qry) {
        try {
            let res = await this.client.query(qry);
            return res;
        } catch(e) {
            console.error(e);
            return false;
        }
    }

    async checkTable(table) {
        return this.query(`
            CREATE TABLE IF NOT EXISTS ${table} (
                key text NOT NULL PRIMARY KEY,
                data json NOT NULL
            );        
        `);
    }

    async get(table, key) {

        if(!key) {
            return this.getTable(table);
        }

        await this.checkTable(table);

        const res = await this.query(`
            SELECT data FROM ${table}
            WHERE key = '${key}';
        `);

        if(res && res.rows && res.rows.length) {
            return res.rows[0].data;
        }

        return undefined;
    }

    async put(table, key, data) {

        await this.checkTable(table);

        await this.query(`
            INSERT INTO "${table}" (key, data)
            VALUES ('${key}', '${JSON.stringify(data).replace(/'/g, "\\'")}')
            ON CONFLICT (key) DO UPDATE 
                SET data = excluded.data;
        `);

        this.event(table, key);
    }

    event(table, key) {
        console.log(`non-store postgres event ${table}/${key}`);
    }

    async remove(table, key) {
        await this.checkTable(table);

        await this.query(`
            DELETE FROM ${table}
            WHERE key = '${key}';
        `);
        this.event(table, key);
    }

    async listKeys(table) {

        await this.checkTable(table);

        const res = await this.query(`SELECT key FROM ${table};`);

        if(res && res.rows && res.rows.length) {
            return res.rows.map(row => row.key);
        }

        return [];
    }

    async getTable(table) {

        await this.checkTable(table);

        const res = await this.query(`
            SELECT * FROM ${table};
        `);

        if(res && res.rows) {
            return res.rows;
        }

        return [];

    }


    async removeTable(table) {

        await this.query(`
            DROP TABLE IF EXISTS ${table};
        `);

        this.event(table);

    }    
}


export class PostgresTableStore extends PostgresTable {

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

// todo: list




