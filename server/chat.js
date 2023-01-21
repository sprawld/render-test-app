
import {db, RedisSet, db_get, db_set} from './redis.js';

const messages = new RedisSet('dm');

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

export async function get_dm(user) {

    let obj = await messages.get(user);

    return obj || {};

}

export async function send_dm(user_from, user_to, message) {

    // let from_obj = await ge

    let current = await get_dm(user_to);

    current[user_from] = [...(current[user_from] || []), message];

    await messages.put(user_to, current);

}

