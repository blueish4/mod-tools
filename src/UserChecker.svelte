<script lang="ts">
	import type { ApiClient, HelixUser } from 'twitch/lib';
	import Userlist from './Userlist.svelte';

	export let apiClient: ApiClient;

	let inputToChecker = "";
	let namesToCheck = [];
	let foundUsers = [] as HelixUser[];
	$: {
		namesToCheck = inputToChecker.trim()
			.split('\n')
			.map((l) => {
				return l.replace("/ban ", "").trim();
			});
		}
	async function checkUsers() {
		for(let i = 0; i<namesToCheck.length; i+=100) {
			foundUsers = [
				...foundUsers,
				...(await apiClient.helix.users.getUsersByNames(namesToCheck.slice(i, i+100)))
			];
		}
	}

	async function saveNewUserlist() {
		await navigator.clipboard.writeText(foundUsers.map(u => u.name).join("\n"))
	}

</script>

<main>
	<Userlist listName="check" bind:text={inputToChecker} />
	<button on:click={checkUsers}>Check!</button>
	<button on:click={saveNewUserlist}>Copy to Clipboard</button>
	<ul>
	{#each foundUsers as known}
		<li>{known.name}</li>
	{/each}
	</ul>
</main>
