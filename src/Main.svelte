<script>

    export let user;

    import Nav from './Nav.svelte';
    import Messages from './Messages.svelte';
	import {mode} from './lib/user.js';
    import Chat from './Chat.svelte';

    let showmenu = false;
	
</script>

<Nav {user}></Nav>

<main>
    {#if $mode === 'chat'}
    <Chat></Chat>
    
    {:else if $mode === 'dm'}
    
    <Messages></Messages>
    
    {:else}
        <h1>No Mode</h1>
    
    {/if}
    
</main>


<style>
    main {
        position:fixed;
        top:50px;
        left:0;
        width:100%;
        bottom:0;
    }
</style>