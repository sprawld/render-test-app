<script>
	import {user} from './lib/user.js';

	import Login from './Login.svelte';
	import Main from './Main.svelte';

</script>

{#if $user}

	<Main user={$user}></Main>

{:else}

	<Login></Login>

{/if}
