<script>

    export let user;

	import {mode, logout} from './lib/user.js';
    import {clear} from './lib/chat.js';
	import { Logout, Menu2, X } from "tabler-icons-svelte";
    import Chat from './Chat.svelte';

    let showmenu = false;

    function togglemenu() {
		showmenu = !showmenu;
	}

</script>

<nav>
    <div class="left">
        <span on:click={() => $mode = 'chat'}>
            [{user.username}]
        </span>
        <!-- <span on:click={() => $mode = 'dm'}>
            DMs
        </span> -->
    </div>
    <div class="right">
        <button class="flat" on:click={togglemenu}>
            <Menu2></Menu2>
        </button>            
    </div>
</nav>

{#if showmenu}

    <main>
        <div class="right">
            <button class="flat" on:click={togglemenu}>
                <X></X>
            </button>            
        </div>
    
        <button on:click={logout}>
            <Logout></Logout>
            Logout
        </button>
        <button on:click={clear}>Clear Chat</button>
    </main>

{/if}

<style>


    nav {
		position:fixed;
		top:0;
        left:0;
        width:100%;
        height:50px;
        border-bottom:1px solid #555;
	}

    nav > div {
        display:inline-block;
    }

    nav .left {
        font-size:28px;
        font-family:monospace;
        padding:10px 15px;
    }

    .right {
        position:absolute;
        top:0;
        right:0;
    }


    :global(button svg, button span) {
		vertical-align:middle;
	}


    button {
		/* border: 4px solid #27ae60; */
		/* background:white; */
		/* background: #27ae60; */
		background: #2ecc71;
		border: 1px solid #27ae60;
		color:white;
		padding:8px 12px;
		margin:5px;
		border-radius:7px;
	}

	button.flat {
		background:rgba(255,255,255,0);
		color:rgba(0,0,0,0.9);
		border:rgba(0,0,0,0.15);
		cursor: pointer;
	}

    main {
        position:fixed;
        z-index:100;
        left:0;
        top:0;
        width:100%;
        height:100%;
        background:white;
        box-sizing: border-box;
        padding:10vmin;
        text-align:center;
    }
	    

</style>