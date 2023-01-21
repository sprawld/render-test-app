<script>
	import {user} from './lib/user.js';

	import Login from './Login.svelte';
	import Main from './Main.svelte';

	fetch('/userlist').then(res => res.json()).then(res => {
		console.log(`userlist`, res);
	})

</script>

{#if $user}

	<Main user={$user}></Main>

{:else}

	<Login></Login>

{/if}
