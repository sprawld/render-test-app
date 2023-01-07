<script>
	
	import {onMount} from 'svelte';

	let text = 'Hello World';
	
	onMount(() => {
		console.log(`loading`);
		load();		
	});

	function load() {
		fetch('/gettxt').then(res => res.json()).then(data => {

			console.log(`got`, data);

			text = data.txt;
		})
	}

	function save() {
		fetch('/settxt', {
			method: 'POST', 
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'same-origin', // include, *same-origin, omit
			headers: {
			'Content-Type': 'application/json'
			// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			redirect: 'follow', // manual, *follow, error
			referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		
		body: JSON.stringify({txt: text})}).then(() => {
			console.log('saved');
		})
	}

</script>

<main>
	<div>
		<button on:click={save}>Save</button>
	</div>

	<textarea bind:value={text}></textarea>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>