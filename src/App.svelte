<script>

    import Login from './components/Login.svelte';
    import Nav from './components/Nav.svelte';
    import Chat from './components/Chat.svelte';

    import {user} from './lib/socketapi.js';

</script>

{#if $user.username}

    <Nav>
        <Chat></Chat>
	</Nav>

{:else}

	<Login></Login>    

{/if}

