
import {RedisStore} from './redis.js';

export const Store = new RedisStore();

export function send_dm(from_user, to_user, msg) {

    Store.update('dm', to_user, current => {
        let obj = current || {};
        let list = obj[from_user] || [];
        obj[from_user] = [...list, {from: from_user, msg}];
        return obj;
    });

}

export function get_dm(username) {

    return Store.get('dm', username);

}

export function sub_dm(username, iterator) {

    return Store.subscribe('dm', username, iterator);

}

// export function sub_dm(username) {

//     return Store.subscribe()

// }


