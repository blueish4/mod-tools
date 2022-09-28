<script lang="ts">
	import type { ApiClient } from '@twurple/api';
	import { HttpStatusCodeError } from '@twurple/api-call'
	import Userlist from "./Userlist.svelte";
	import { lineToUsername } from './utils';

	export let apiClient: ApiClient;

	const rateLimit = 30000/100;

	let reason = "";
	let goFast = true;
	let usersToBan: string[];
	let rawToBan: string;
	let status = "ready";
	$: if (!!rawToBan) usersToBan = rawToBan.trim().split("\n");

	async function banUsers(users: string[], reason: string, channel: string) {
		const broadcaster = await apiClient.users.getUserByName(channel);
		const moderator = (await apiClient.getTokenInfo()).userId as string;
		for (let userPage = 0; userPage < users.length; userPage += 100) {
			const candidates = users.slice(userPage, userPage + 100).map(u => lineToUsername(u));
			let knownUsers = [] as Array<string>;
			if (goFast) {
				knownUsers = (await apiClient.users.getUsersByNames(candidates))
					.map(user => user.id);
			} else {
				knownUsers = candidates;
			}
			for (const [index, user_id] of knownUsers.entries()) {
				const userIndex = userPage + index;
				status = `banning user ${userIndex} of ${users.length}. Expected time remaining: ${(users.length - (userIndex))*apiClient.lastKnownLimit}s`;
				try {
					apiClient.moderation.banUser(broadcaster, moderator, {userId: user_id, reason});
				} catch (err) {
					if (err instanceof HttpStatusCodeError) {
						console.error(err.message);
					} else {
						throw err;
					}
				}
			}
		}
		status = "completed!";
	}

	function banUserWrapper() {
		apiClient.users.getMe().then((ownUser) => {
			banUsers(usersToBan, reason, ownUser.name);
		});
	}
</script>

<main>
	<Userlist listName="ban" bind:text={rawToBan} />
	<div id="fastModeOption">
		<input type="checkbox" bind:checked={goFast} name="fastMode" id="fastMode" />
		<label for="fastMode">Use fast mode</label>
	</div>
	<input type="text" bind:value={reason} placeholder="reason" />
	<button on:click={banUserWrapper}>GO!</button>
	<p>Status: {status}</p>
</main>

<style>
	#fastModeOption *{
		display: inline;
	}
</style>