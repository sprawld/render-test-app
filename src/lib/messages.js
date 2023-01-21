

import {socket} from './socket.js';
import { writable } from 'svelte/store';

export const messages = writable([]);

socket.on('dm-set', data => {
    console.log(`dm-set`, data);
    message.set(data);
});

socket.on('dm-add', data => {
    console.log(`dm-add`, data);
    message.update(current => [ ...current, data]);
});

export function dm(msg) {
    socket.emit('dm', msg);
}
