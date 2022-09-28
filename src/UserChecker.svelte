<script lang="ts">
	import type { ApiClient, HelixUser } from '@twurple/api';
	import Userlist from './Userlist.svelte';
	import { lineToUsername } from './utils';

	export let apiClient: ApiClient;

	let inputToChecker = "";
	let namesToCheck = [];
	let status = "ready";
	let foundUsers = [] as HelixUser[];
	$: {
		namesToCheck = inputToChecker.trim()
			.split('\n')
			.flatMap((l) => {
				try {
					return lineToUsername(l);
				} catch (e) {
					console.error(e);
					return [];
				}
			})
		}
	async function checkUsers() {
		for(let i = 0; i<namesToCheck.length; i+=100) {
			status = `testing ${i} of ${namesToCheck.length}`;
			foundUsers = [
				...foundUsers,
				...(await apiClient.users.getUsersByNames(namesToCheck.slice(i, i+100)))
			];
			console.log(foundUsers.map(u=>u.name));
		}
		status = "completed!";
	}

	async function saveNewUserlist() {
		await navigator.clipboard.writeText(foundUsers.map(u => u.name).join("\n"))
	}

</script>

<main>
	<Userlist listName="check" bind:text={inputToChecker} />
	<p>Status: {status}</p>
	<button on:click={checkUsers}>Check!</button>
	<button on:click={saveNewUserlist}>Copy to Clipboard</button>
	<ul>
	{#each foundUsers as known}
		<li>{known.name}</li>
	{/each}
	</ul>
</main>
