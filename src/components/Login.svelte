<script>

    import { Logout, Login, Plus, Menu2 } from "tabler-icons-svelte";
    import {user, login, logout, send, post} from '../lib/socketapi.js';
	import {palette} from '../lib/colors.js';

    let {
        username = '',
        password = ''
    } = JSON.parse(localStorage.getItem('user') || '{}');

    if(username && password) {
        login(username, password);
    }

    function loginuser(evt) {
        evt.preventDefault();
        login(username, password);
    }

    function logoutuser(evt) {
        evt.preventDefault();
        logout(username, password);
    }

    function sendsecret() {
        send('secret', {hello: 'world'});
    }


	async function createuser(evt) {
		if(evt) evt.preventDefault();
		await post('/create', {username, password, data: {color: palette(2)[0]}});
        login(username, password);
	}


</script>

<section id="login" class:loginerror={$user.error}>
    <form>
        <div>
            <label for="username">Username</label>
            <input id="username" bind:value={username} />

            <label for="password">Password</label>
            <input id="password" bind:value={password} />
        </div>
        <br>

        {#if $user.error}

            <div class="error">
                {$user.error}
            </div>
            <br>
            
        {/if}

        <div>
            <button type="submit" on:click={loginuser}>
                <Login></Login>
                <span>Login</span>
            </button>
            <button on:click={createuser}>
                <Plus></Plus>
                <span>Create</span>
            </button>
        </div>
    </form>
</section>


<style>

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

	#login {
		position:fixed;
		top:50%;
		left:50%;
		transform:translate(-50%,-50%);
		border:1px solid rgba(0,0,0,0.5);
		border-radius:5px;
		padding:20px;
	}

	#login label {
		margin:20px 0 10px;
		font-weight:bold;
	}

	#login.loginerror input {
		border: 1px solid #ff3e00; 
	}

	#login.loginerror {
		border: 1px solid #ff3e00; 
	}

	.error {
		color: #ff3e00;
		font-weight:bold;
	}

</style>