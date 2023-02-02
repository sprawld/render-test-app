
import {listdb} from '../server/liststore.js'

async function test() {


    let obj = await listdb.getRows('test');

    console.log(obj);

    await listdb.removeRows('test', 0,2);

    let obj2 = await listdb.getRows('test');

    console.log(obj2);

    await listdb.addRow('test', {hello: 'there'});

    let obj1 = await listdb.getRows('test');

    console.log(obj1);

    let count = await listdb.countRows('test');

    console.log(`count:`, count);

}


test();