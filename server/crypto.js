



import nacl from 'tweetnacl';
import utils from 'tweetnacl-util';


// 1: Public Key Encryption

export function create_keys() {

    let {publicKey, secretKey} = nacl.box.keyPair();
    return {
        publicKey: enc(publicKey),
        secretKey: enc(secretKey),
    };
}



export function encrypt_msg(my_secret_key, dest_public_key, msg) {

    const nonce = nacl.randomBytes(24)

    // Bob encrypts message for Alice
    const box = nacl.box(
        utils.decodeUTF8(msg),
        nonce,
        dec(dest_public_key),
        dec(my_secret_key),
    )
   
    return base64enc([box, nonce]);

}


export function decrypt_msg(my_secret_key, src_public_key, obj) {

    let [box, nonce] = base64dec(obj);

    const open_box = nacl.box.open(
        box, 
        nonce, 
        dec(src_public_key),
        dec(my_secret_key),
    );
    
    return utils.encodeUTF8(open_box);

}


function enc(obj) {
    return Buffer.from(obj).toString('base64');
}

function dec(obj) {
    return Buffer.from(obj, 'base64')
}

function base64enc(obj) {
    return obj.map(enc).join('.');
    // let res = {};
    // Object.keys(obj).forEach(key => {
    //     res[key] = enc(obj[key]);
    // });
    // return res;
}

function base64dec(obj) {
    return obj.split('.').map(dec);
    let res = {};
    Object.keys(obj).forEach(key => {
        res[key] = dec(obj[key]);
    });
    return res;
}




export function encode_msg(password, msg) {

    const secret = password_key(password);    
    const nonce = nacl.randomBytes(24);
    
    const box = nacl.secretbox(
        utils.decodeUTF8(msg), 
        nonce, 
        secret,
    );
    
    return base64enc([box, nonce]);
}


function password_key(password) {

    const KEY_LEN = nacl.secretbox.keyLength
    let secret_key = utils.decodeUTF8(password);
    
    let full_key = new Uint8Array(KEY_LEN);
    full_key.set(secret_key);
    
    const secret = nacl.sign.keyPair.fromSeed(full_key);

    return secret.publicKey;
}


export function decode_msg(password, obj) {

    let [box, nonce] = base64dec(obj);

    const secret = password_key(password);
    
    const open_box = nacl.secretbox.open(
        box, 
        nonce, 
        secret,
    );
    
    return utils.encodeUTF8(open_box);

}
