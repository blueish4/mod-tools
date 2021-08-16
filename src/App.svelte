<script lang="ts">
	import { StaticAuthProvider } from 'twitch-auth';
	import { ApiClient } from 'twitch';
	import Banned from './Banned.svelte';
	import Banner from './Banner.svelte';
	import { CLIENT_ID } from './env';
	import type { HelixUserBlock } from 'twitch/lib/API/Helix/User/HelixUserBlock';
	import UserChecker from './UserChecker.svelte';

	const clientId = CLIENT_ID;
	const redirectUri = window.location.protocol + '//' + window.location.host
	const scopes = ["chat:edit", "chat:read", "channel:moderate","user:manage:blocked_users","user:read:blocked_users", "user:read:email", "channel:read:redemptions"]
	let apiClient: ApiClient;
	let accessToken: string;

	let blockedUsers: HelixUserBlock[];

	apiClient = getApiClient()
	function getApiClient() {
		if (window.location.hash.indexOf("access_token") > 0) {
			accessToken = window.location.hash.match(/access_token=(?<token>[0-9a-z]+)&/).groups["token"];
			const authProvider = new StaticAuthProvider(clientId, accessToken);
			window.history.replaceState(null, null, '/');
			return apiClient = new ApiClient({ authProvider });
		}
	}
</script>

<main>
	<div id="container">
		<h1>Blueish mod tools</h1>
		<p>
			This simple page allows you to view the accounts you currently have blocked and
			ban accounts in bulk from your chat. Users that have been <em>blocked</em>
			(such as those using a tool like
			<a href="https://twitch-tools.rootonline.de/blocklist_manager.php">
				CommanderRoot's Blocklist manager
			</a>) are still able to send messages in your public chat channel (while being
			prevented from sending whispers, hosting or following you
			<a href="https://help.twitch.tv/s/article/how-to-manage-harassment-in-chat#BlockWhispersandMessagesfromStrangers">etc</a>
			). Banning a user prevents them from sending any messages in your channel.
		</p>
		<p>
			Please log in with your Twitch account (don't worry, no passwords or access tokens
			get sent to me - this is purely between you and Twitch), then input the names to
			ban from your chat one per line into the large textbox. Optionally, add a reason
			to be applied to every ban, then watch the status until it says completed!
		</p>
	{#if !apiClient}
		<a href="https://id.twitch.tv/oauth2/authorize?client_id={clientId}&redirect_uri={encodeURIComponent(redirectUri)}&response_type=token&scope={encodeURIComponent(scopes.join(" "))}">Log in to Twitch</a>
	{:else}
		<div id="pageContent">
			{#await apiClient then apiClient}
				<h2>Bulk ban users</h2>
				<Banner apiClient={apiClient} accessToken={accessToken}/>
				<h2>Fetch blocked users</h2>
				<Banned apiClient={apiClient} bind:blocked={blockedUsers}/>
				<h2>Banlist maintainer</h2>
				<p>
					Sometimes, Twitch decides to do it's job and delete the bot and spam accounts,
					so they don't need to be banned from your chat. Accounts that are banned
					for ToS violations cannot have their names recycled, so this simply checks
					to see if there is an account with that name. Please use this to update
					any ban lists you share so that people don't waste time banning dead accounts.
				</p>
				<UserChecker apiClient={apiClient} />
			{/await}
		</div>
	{/if}
	<p>Made with ♥️ by blueish, see code and post issues/improvements on <a href="https://github.com/blueish4/mod-tools">GitHub</a></p>
	</div>
</main>

<style>
	main {
		text-align: left;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	#container {
		display: block;
		max-width: 720px;
		margin-left: auto;
		margin-right: auto;
	}
</style>