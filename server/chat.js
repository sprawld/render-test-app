
import {db} from './redis.js';

export async function get_chat() {

    let chat = await db.lrange('chat', 0, -1);
    return chat.reverse().map(JSON.parse);

}

export async function add_chat(user, msg) {

    return db.lpush('chat', [JSON.stringify({user, msg})]);

}

export async function clear_chat() {

    // let chat = await get_chat();
    return db.del('chat');

}