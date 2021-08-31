<script lang="ts">
	import type { ApiClient } from "twitch/lib";
	import tmi from "tmi.js";
	import Userlist from "./Userlist.svelte";

	export let apiClient: ApiClient;
	export let accessToken: string;

	const rateLimit = 30000/100;

	let reason = "";
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
			for (const [index, user] of users.entries()) {
				status = `banning user ${index} of ${users.length}. Expected time remaining: ${(users.length - index)*rateLimit/1000}s`;
				client.say(channel, `/ban ${user.replace("/ban ", "").trim().split(" ")[0]} ${reason}`);
				await new Promise(res => { setTimeout(res, rateLimit); });
			}
			status = "completed!";
		}).catch(() => {
			status = "error";
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
	<input type="text" bind:value={reason} placeholder="reason" />
	<button on:click={banUserWrapper}>GO!</button>
	<p>Status: {status}</p>
</main>
