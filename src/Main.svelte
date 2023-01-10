<script>

    export let user;

    import Nav from './Nav.svelte';

	import {logout} from './lib/user.js';
    import {clear} from './lib/chat.js';
	import { Logout, Menu2 } from "tabler-icons-svelte";
    import Chat from './Chat.svelte';

    let showmenu = false;
	
</script>

<Nav {user}></Nav>

<Chat></Chat>

