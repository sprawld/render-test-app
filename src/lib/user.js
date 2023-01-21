
import { writable } from 'svelte/store';
import { socket } from './socket.js';

export const user = writable(false)
export const error = writable(false);
export const mode = writable('chat');

socket.on('login', data => {
    console.log(`login`, data);
    if(data.error) {
        error.set(data.error);
        localStorage.setItem('user', JSON.stringify({}));
    } else {
        error.set(false);
        user.set(data);
    }
});

export function login(username, password) {

    socket.emit('login', {username, password});
    localStorage.setItem('user', JSON.stringify({username, password}));

}

export function create(username, password, data = {}) {

    socket.emit('create', {username, password, data});

}

export function logout() {
    user.set(false);
    localStorage.setItem('user', JSON.stringify({}));
}

