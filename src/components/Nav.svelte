<script>

	import {user, socketstore, logout, send} from '../lib/socketapi.js';
	import {palette} from '../lib/colors.js';
	import { Logout, Menu2, X } from "tabler-icons-svelte";

    let showmenu = false;
    const users = socketstore('users');

    function togglemenu() {
		showmenu = !showmenu;
	}

    function deleteusers() {
        socket.emit('clearusers');
    }

    function deluser() {
        socket.emit('removeme', {});
    }

    function getnavcolor(data) {
        if(data && data.color) {
            let {r=50, g=50, b=50} = data.color;
            return `linear-gradient(to right, rgba(${r},${g},${b},0.5), rgba(${r},${g},${b},0.5) 75%, rgba(240,240,240,1) 100%)`

            return [r,g,b].join(',');
        }
        return 'lightblue';
    }

    function getmainbackground(data) {
        if(data && data.color) {
            // background: linear-gradient(#e66465, #9198e5);
            let {r,g,b} = data.color;
            return `linear-gradient(rgba(240,240,240,1), rgba(240,240,240,1) 75%, rgba(${r},${g},${b},0.5) 100%)`
        }
        return 'lightgreen';
    }

    function changecolor() {

        send('update', {color: palette(2)[0]})
        showmenu = false;
    }


</script>

<nav style="background:{getnavcolor(($users && $users[$user.username] || $user.data))};" class:open={showmenu}>
    <div class="left">
        <span>[{$user.username}]</span>
    </div>
    <div class="right">
        <button class="flat" on:click={togglemenu}>
            {#if showmenu}
                <X></X>
            {:else}
                <Menu2></Menu2>
            {/if}
        </button>            
    </div>

    <section id="navmenu">
            <div>
                <button on:click={logout}>
                    <Logout></Logout>
                    Logout
                </button>
            </div>
            <div>
                <button on:click={changecolor}>
                    Change Colour
                </button>
            </div>
            <div>
                <button on:click={deluser}>
                    Delete Me
                </button>                
            </div>
    </section>

</nav>

<main style="background:{getmainbackground($user.data)};">

    <slot></slot>

</main>

<style>

    main {
        position:fixed;
        top:50px;
        bottom:0;
        left:0;
        width:100%;
        overflow:auto;
        font-size:28px;
    }


    nav {
		position:fixed;
		top:0;
        z-index:100;
        left:0;
        width:100%;
        height:50px;
        border-bottom:1px solid #555;
        overflow-y:hidden;
        background:#ccc;
        transition:all 0.5s;
	}

    nav.open {
        height:100%;
    }

    nav > div {
        display:inline-block;
    }

    nav .left {
        font-size:28px;
        font-family:monospace;
        padding:10px 15px;
    }

    nav .left span:hover {
        font-weight:bold;
        cursor:pointer;
    }

    nav .left span.select {
        font-weight:bold;
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
		/* background: #2ecc71; */
        background:rgba(0,0,0,0.4);
        border:1px solid rgba(0,0,0,0.8);
		/* border: 1px solid #27ae60; */
		color:white;
		padding:8px 12px;
		margin:5px;
		border-radius:7px;
	}

    button:hover {
        background:rgba(0,0,0,0.6);
    }

	button.flat {
		background:rgba(255,255,255,0);
		color:rgba(0,0,0,0.9);
		border:rgba(0,0,0,0.15);
		cursor: pointer;
	}

    #navmenu {
        position:absolute;
        left:0;
        top:50px;
        width:100%;
        bottom:0;
        overflow-y:auto;
        /* background:white; */
        box-sizing: border-box;
        padding:10vmin;
        text-align:center;
    }
	    

</style>