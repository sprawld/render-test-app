
// create subscribable class
// a socket user can listen to a name/key
// when it changes the socket is updated

import { RedisStore } from "./redis";

let store = new RedisStore();

export async function subscribe(name, key, iter) {

    let data = await store.get(name, key);
    iter(data);
    store.subscribe(name, key, iter);

}
