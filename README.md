
# Test Express for running on Render

test app, playing around with render.com, encryption & server tech

- Runs demo svelte app
- Express server
- Socket.io connection

## Security/Encrpytion

- bcrypt hasing of passwords


## Redis/Socket Store Setup

## HTTP/Socket Server

{
    app, io,

    http: {

        verify: req => res,

        plain: {
            get: {
                'noauth/path': (req) => res
            }
        },

        auth: {
            get: {
                'path/to/use': (req) => res
                'root': {
                    'deeper/path': (req) => res
                }
            }
        },
        
    },

    socket: {

        verify:

    }

}



## JSON Store Subscription Model

The aim is to allow subscriptions to multiple sources:

- Postgres Table/List
- Redis Data

## Store API

get(location) => data
subscribe(location, iterator) => unsubscribe function

each change to the store is an exec: put, add, remove

