<script>


	import {tick} from 'svelte';
	import { Logout, Login, Plus, Menu2 } from "tabler-icons-svelte";
	
	let loaded = false;
	let user = false;
	let error = false;

	let showmenu = false;

	// elem
	let userinput;

	let {username  = '', password = ''} = JSON.parse(localStorage.getItem('user') || '{}');

	login().then(async () => {
		loaded = true;
		await tick();
		if(!user) {
			userinput.focus();
		}
	});

	function set_user(obj) {

		if(obj.error) {
			user = false;
			error = obj.error;
		} else {
			error = false;
			user = obj;
			showmenu = false;
			localStorage.setItem('user', JSON.stringify({username, password}));
			password = '';
		}
	} 

	async function login(evt) {
		if(evt) evt.preventDefault();

		if(!username || !password) {
			return false;
		}
		let res = await fetch('/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({username, password})
		}).then(res => res.json());

		console.log(`user login`, res);
		set_user(res);
		return true;
	}

	async function create(evt) {
		if(evt) evt.preventDefault();

		let res = await fetch('/user/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({username, password})
		}).then(res => res.json());

		console.log(`user create`, res);

		set_user(res);

	}

	function logout() {
		user = false;
		localStorage.setItem('user', '{}');
	}

	function togglemenu() {
		showmenu = !showmenu;
	}

</script>

{#if loaded}

	{#if user}

		<nav>
			<button class="flat" on:click={togglemenu}>
				<Menu2></Menu2>
			</button>
		</nav>

		{#if showmenu}

			<main>
				<button on:click={logout}>
					<Logout></Logout>
					Logout
				</button>
			</main>

		{:else}
			
			<main>
				<div>
					<h1>{username} Logged in</h1>
				</div>
			</main>

		{/if}


	{:else}

		<section id="login" class:loginerror={error}>
			<form>
				<div>
					<label>Username</label>
					<input bind:this={userinput} bind:value={username} />

					<label>Password</label>
					<input bind:value={password} />
				</div>
				<br>

				{#if error}

					<div class="error">
						{error}
					</div>
					<br>

				{/if}

				<div>
					<button type="submit" on:click={login}>
						<Login></Login>
						<span>Login</span>
					</button>
					<button on:click={create}>
						<Plus></Plus>
						<span>Create</span>
					</button>
				</div>
			</form>
		</section>

	{/if}

{/if}


<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
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

	nav {
		position:fixed;
		right:0;
		top:0;
	}

	button.flat {
		background:rgba(255,255,255,0);
		color:rgba(0,0,0,0.9);
		border:rgba(0,0,0,0.15);
		cursor: pointer;
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

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	.error {
		color: #ff3e00;
		font-weight:bold;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>