
function get_keys(location) {
    if(Array.isArray(location)) {
        return location;
    }
    return location.split('/');
}


function get_plain(data, location) {
    let keys = get_keys(location);
    return get_item(data, keys);
}

function get_item(data, keys) {

    let d = data;
    try {
        keys.forEach(k => {
            d = d[k];
        });
        return d;
    } catch(e) {
        return undefined;
    }

}


function put_plain(data, location, obj) {
    let keys = get_keys(location);
    let d = data;
    try {
        for(let i=0;i<keys.length-1;i++) {
            d = d[keys[i]];
        }
        d[keys[keys.length-1]] = obj;
        return obj;
    } catch(e) {
        return false;
    }
}

function remove_plain(data, location) {

    let keys = get_keys(location);
    if(keys.length === 1) {
        return remove_item(data, keys[0]);
    }
    let obj = get_item(data, keys.slice(0,-1))
    if(obj) {
        return remove_item(obj, keys[keys.length-1]);
    }
    return false;
}

function remove_item(obj, key) {

    if(Array.isArray(obj)) {
        let index = Number(key);
        if(index >= 0 && index < obj.length) {
            obj.splice(index, 1);
            return true;
        }
        return false;
    }
    if(typeof obj === 'object') {
        delete obj[key];
        return true;
    }
    return false;

}


module.exports = { get_plain, put_plain, remove_plain }