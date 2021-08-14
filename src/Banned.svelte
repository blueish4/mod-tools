<script lang="ts">
	import type { ApiClient, HelixPaginatedResult } from 'twitch/lib';
	import type { HelixForwardPagination } from 'twitch/lib/API/Helix/HelixPagination';
	import type { HelixUserBlock } from 'twitch/lib/API/Helix/User/HelixUserBlock';

	export let apiClient: ApiClient;
	export let blocked = [] as HelixUserBlock[];

	let blockedUsers = {data: []} as HelixPaginatedResult<HelixUserBlock>;
	let pageSize = 10;


	async function getBlockedUsers(page?: string) {
		const me = await apiClient.helix.users.getMe()
		const pagination = {
			after: page,
			limit: pageSize.toString()
		} as HelixForwardPagination
		return await apiClient.helix.users.getBlocks(me.id, pagination)
	}

	async function extendBlockedExport() {
		blockedUsers = await getBlockedUsers(blockedUsers.cursor)
		blocked.push(...blockedUsers.data)
	}

</script>

<main>
	<p>Request <input type="number" max="100" min="1" bind:value={pageSize}/></p>
	{#if blockedUsers}
	<ul>
		{#each blockedUsers.data as bUser}
			<li>{bUser.userName}</li>
		{/each}
	</ul>
	<button on:click={async () => await extendBlockedExport()}>get more blocked</button>
	{/if}
</main>