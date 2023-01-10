<script>

	import {user, error, login, create} from './lib/user.js';
	import {palette} from './lib/colors.js';

	let userinput;

	import {tick} from 'svelte';
	import { Logout, Login, Plus, Menu2 } from "tabler-icons-svelte";
	
	// elem

	let {username  = '', password = ''} = JSON.parse(localStorage.getItem('user') || '{}');

	if(username && password) {
		userlogin();
	}

	function userlogin(evt) {
		if(evt) evt.preventDefault();
		login(username, password);
	}

	function usercreate(evt) {
		if(evt) evt.preventDefault();
		create(username, password, {color: palette(2)[0]});
	}

</script>

<section id="login" class:loginerror={$error}>
    <form>
        <div>
            <label for="username">Username</label>
            <input id="username" bind:this={userinput} bind:value={username} />

            <label for="password">Password</label>
            <input id="password" bind:value={password} />
        </div>
        <br>

        {#if $error}

            <div class="error">
                {$error}
            </div>
            <br>
            
        {/if}

        <div>
            <button type="submit" on:click={userlogin}>
                <Login></Login>
                <span>Login</span>
            </button>
            <button on:click={usercreate}>
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