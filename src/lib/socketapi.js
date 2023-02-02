

import { writable } from 'svelte/store';

import {io} from 'socket.io-client';

export const socket = io();

let token;
export const user = writable({})

socket.on('login', data => {
    console.log(`login`, data);
    user.set(data);
    token = data.token;
});

socket.on('logout', () => {
    user.set({});
    token = undefined;
    localStorage.setItem('user', JSON.stringify({}));
});


export function login(username, password) {

    socket.emit('login', {username, password});
    localStorage.setItem('user', JSON.stringify({username, password}));

}

export function create(username, password, data = {}) {

    socket.emit('create', {username, password, data});
    localStorage.setItem('user', JSON.stringify({username, password}));

}

export function logout() {
    // user.set(false);
    // localStorage.setItem('user', JSON.stringify({}));
    socket.emit('logout');
}

export function send(name, data = {}) {
    socket.emit(name, {...data, token});
}


export function socketstore(location) {

    return {
        subscribe(iterator) {

            let id = window.crypto.randomUUID();

            console.log(`store ${location} sub: ${id}`)

            send('subscribe', {id, location});

            socket.on(location, data => {
                console.log(`store sub ${id}`, data);
                iterator(data);
            });

            return () => {
                // unsubscribe
                console.log(`store unsub ${id}`);
                send('unsubscribe', {id, location});
                socket.off(location, iterator);
            }
        }
    }

}

// HTTP Utils (also using token if available)

export function post(url, data) {

    return fetch(url, {

        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'x-token': token || '',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data),
    }).then(res => res.json()).catch(() => false);

}

export function get(url) {
    
    return fetch(url, {
        headers: {
            'x-token': token || ''
        }
    }).then(res => res.json()).catch(() => false);

}
