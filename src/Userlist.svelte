<script lang="ts">
	export let listName: string;
	export let text = ""
	let userCount = 0
	$: userCount = text.trim().split("\n").length
</script>

<main>
	<div>
		<textarea bind:value={text} placeholder="Users to {listName}: 1 per row"></textarea>
		<p>You have currently {userCount} user{#if userCount !== 1}s{/if} to
			{listName}
		</p>
	</div>
</main>

<style>

</style>
