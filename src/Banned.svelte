<script lang="ts">
	import type { ApiClient, HelixPaginatedResult, HelixForwardPagination, HelixUserBlock } from '@twurple/api';

	export let apiClient: ApiClient;
	export let blocked = [] as HelixUserBlock[];

	let blockedUsers = {data: []} as HelixPaginatedResult<HelixUserBlock>;
	let pageSize = 10;


	async function getBlockedUsers(page?: string) {
		const me = await apiClient.users.getMe()
		const pagination = {
			after: page,
			limit: pageSize
		} as HelixForwardPagination;
		return await apiClient.users.getBlocks(me.id, pagination);
	}

	async function extendBlockedExport() {
		blockedUsers = await getBlockedUsers(blockedUsers.cursor);
		blocked.push(...blockedUsers.data);
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