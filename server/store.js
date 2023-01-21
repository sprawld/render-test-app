
import pg from "pg";

const { Client } = pg;

const {
    DB_USER = 'postgres',
    DB_HOST = 'localhost',
    DB_DATABASE = 'postgres',
    DB_PASSWORD = 'mysecretpassword',
    DB_PORT = 5432,
} = process.env;

export class PostgresStore {

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

        this.client = client;

        this.promise = client.connect();

        this.tables = {};

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

    async getTable(table) {
        return this.query(`
            CREATE TABLE IF NOT EXISTS ${table} (
                id text NOT NULL PRIMARY KEY,
                data json NOT NULL
            );        
        `);
    }

    async get(table, id) {

        await this.getTable(table);

        const res = this.query(`
            SELECT data FROM ${table}
            WHERE id = '${id}';
        `);

        if(res && res.rows && res.rows.length) {
            return res.rows[0].data;
        }

        return undefined;
    }

    async put(table, id, data) {

        await this.getTable(table);

        await this.query(`
            INSERT INTO "${table}" (id, data)
            VALUES ('${id}', '${JSON.stringify(data).replace(/'/g, "\\'")}')
            ON CONFLICT (id) DO UPDATE 
                SET data = excluded.data;
        `);

    }

    async remove(table, id) {
        const {client} = this;
        await this.getTable(table);

        await client.query(`
            DELETE FROM ${table}
            WHERE id = '${id}';
        `);
    }

    async listKeys(table) {

        await this.getTable(table);

        const res = await this.query(`SELECT id FROM ${table};`);

        if(res && res.rows && res.rows.length) {
            return res.rows.map(row => row.id);
        }

        return [];
    }

    create(table) {
        return {
            get: (id) => this.get(table, id),
            listKeys: () => this.listKeys(table),
            put: (id, data) => this.put(table, id, data),
            remove: (id) => this.remove(table, id),
        }
    }
}

