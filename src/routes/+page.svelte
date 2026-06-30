<script>
	import { page } from '$app/stores';
	import NoteCard from '$lib/components/NoteCard.svelte';

	export let data;
	export let form;
	$: deleted = $page.url.searchParams.get('deleted') === '1';
</script>

<svelte:head>
	<title>Notes App - Home</title>
</svelte:head>

{#if !data.user}
	{#if deleted}
		<div class="notification is-success" role="status">
			Your account has been deleted.
		</div>
	{/if}
	<section class="hero is-medium hero-bg">
		<div class="hero-body">
			<h1 class="title">Your notes, organised.</h1>
			<p class="subtitle">Save plain-text notes and sort them into categories.</p>
			<div class="buttons">
				<a class="button is-light" href="/login">Log in</a>
				<a class="button is-light" href="/register">Register</a>
			</div>
		</div>
	</section>
{:else}
	<h1 class="title">Your notes</h1>

	{#if data.categories.length > 0}
		<nav class="tags" aria-label="Filter notes by category">
			{#each data.categories as category}
				<a class="tag is-link is-light" href="/category/{category.id}">{category.name}</a>
			{/each}
		</nav>
	{/if}

	<form method="POST" action="?/create" class="box">
		<h2 class="subtitle">New note</h2>
		{#if form?.error}
			<p class="help is-danger" role="alert">{form.error}</p>
		{/if}
		{#if form?.success}
			<p class="help is-success" role="status">Note saved.</p>
		{/if}
		<div class="field">
			<label class="label" for="title">Title</label>
			<div class="control">
				<input class="input" id="title" name="title" type="text" required maxlength="100" />
			</div>
		</div>
		<div class="field">
			<label class="label" for="body">Note</label>
			<div class="control">
				<textarea class="textarea" id="body" name="body" rows="4" required maxlength="5000"
				></textarea>
			</div>
		</div>
		<div class="field">
			<label class="label" for="category_id">Category</label>
			<div class="control">
				<div class="select">
					<select id="category_id" name="category_id">
						<option value="">Uncategorised</option>
						{#each data.categories as category}
							<option value={category.id}>{category.name}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>
		<div class="control">
			<button class="button is-primary" type="submit">Save note</button>
		</div>
	</form>

	{#if data.notes.length === 0}
		<p>You have no notes yet. Use the form above to create your first note.</p>
	{:else}
		<ul class="notes-list">
			{#each data.notes as note}
				<li><NoteCard note={note} /></li>
			{/each}
		</ul>
	{/if}
{/if}
