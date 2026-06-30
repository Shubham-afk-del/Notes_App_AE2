<script>
	import NoteCard from '$lib/components/NoteCard.svelte';

	export let data;
</script>

<svelte:head>
	<title>{data.category.name} - Notes App</title>
</svelte:head>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<ul>
		<li><a href="/">Home</a></li>
		<li class="is-active">
			<a href="/category/{data.category.id}" aria-current="page">{data.category.name}</a>
		</li>
	</ul>
</nav>

<h1 class="title">Category: {data.category.name}</h1>

{#if data.notes.length === 0}
	<p>There are no notes in this category yet.</p>
{:else}
	<ul class="notes-list">
		{#each data.notes as note}
			<li><NoteCard note={note} /></li>
		{/each}
	</ul>
{/if}
