<script lang="ts">
	import type { ApiClient } from "twitch/lib";
	import tmi from "tmi.js";
	import Userlist from "./Userlist.svelte";
	import { lineToUsername } from './utils';

	export let apiClient: ApiClient;
	export let accessToken: string;

	const rateLimit = 30000/100;

	let reason = "";
	let goFast = true;
	let usersToBan: string[];
	let rawToBan: string;
	let status = "ready";
	$: if (!!rawToBan) usersToBan = rawToBan.trim().split("\n");

	function banUsers(users: string[], reason: string, channel: string) {
		//connect to IRC API
		status = "connecting";
		const client = new tmi.Client({
			options: {
				skipUpdatingEmotesets: true,
				updateEmotesetsTimer: 0,
			},
			identity: {
				username: channel,
				password: `oauth:${accessToken}`,
			},
			connection: {
				reconnect: true,
				secure: true,
			},
			channels: [channel],
		});
		client.connect().then(async () => {
			for (let userPage = 0; userPage < users.length; userPage += 100) {
				const candidates = users.slice(userPage, userPage + 100).map(u => lineToUsername(u));
				let knownUsers = [];
				if (goFast) {
					knownUsers = (await apiClient.helix.users.getUsersByNames(candidates))
						.map(user => user.name);
				} else {
					knownUsers = candidates;
				}
				for (const [index, user] of knownUsers.entries()) {
					const userIndex = userPage + index;
					status = `banning user ${userIndex} of ${users.length}. Expected time remaining: ${(users.length - (userIndex))*rateLimit/1000}s`;
					client.say(channel, `/ban ${user} ${reason}`);
					await new Promise(res => { setTimeout(res, rateLimit); });
				}
			}
			status = "completed!";
		}).catch((e: Error) => {
			status = `error: ${e.message}`;
		});
	}

	function banUserWrapper() {
		apiClient.helix.users.getMe().then((ownUser) => {
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