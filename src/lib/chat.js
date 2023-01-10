

import {socket} from './socket.js';
import { writable } from 'svelte/store';

export const conversation = writable([]);

socket.on('chat-set', data => {
    console.log(`chat-set`, data);
    conversation.set(data);
});

socket.on('chat-add', data => {
    console.log(`chat-add`, data);
    conversation.update(current => [ ...current, data]);
});

export function chat(msg) {
    socket.emit('chat', msg);
}

export function clear() {
    socket.emit('clearchat', {});
}