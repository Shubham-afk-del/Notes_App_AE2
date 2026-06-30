<script>
	import { onMount } from 'svelte';

	export let data;
	export let form;

	let theme = 'light';

	onMount(() => {
		theme = localStorage.getItem('theme') || 'light';
	});

	function setTheme(value) {
		theme = value;
		localStorage.setItem('theme', value);
		document.documentElement.setAttribute('data-theme', value);
	}
</script>

<svelte:head>
	<title>Settings - Notes App</title>
</svelte:head>

<h1 class="title">Settings</h1>

<section class="box">
	<h2 class="subtitle">Appearance</h2>
	<p class="mb-3">Choose a day or night theme. Your choice is saved on this device.</p>
	<div class="buttons">
		<button
			class="button"
			class:is-primary={theme === 'light'}
			type="button"
			on:click={() => setTheme('light')}
		>
			Day
		</button>
		<button
			class="button"
			class:is-primary={theme === 'dark'}
			type="button"
			on:click={() => setTheme('dark')}
		>
			Night
		</button>
	</div>
</section>

<h2 class="subtitle">Manage your categories</h2>

<form method="POST" action="?/addCategory" class="box" style="max-width: 30rem;">
	{#if form?.error}
		<p class="help is-danger" role="alert">{form.error}</p>
	{/if}
	{#if form?.success}
		<p class="help is-success" role="status">Category added.</p>
	{/if}
	<div class="field">
		<label class="label" for="name">New category</label>
		<div class="control">
			<input class="input" id="name" name="name" type="text" required maxlength="50" />
		</div>
	</div>
	<div class="control">
		<button class="button is-primary" type="submit">Add category</button>
	</div>
</form>

{#if data.categories.length === 0}
	<p>You have no categories yet. Add one above.</p>
{:else}
	<ul class="categories-list">
		{#each data.categories as category}
			<li class="box is-flex is-justify-content-space-between is-align-items-center">
				<a href="/category/{category.id}">{category.name}</a>
				<form method="POST" action="?/removeCategory">
					<input type="hidden" name="id" value={category.id} />
					<button
						class="button is-small is-danger"
						type="submit"
						aria-label="Remove category {category.name}">Remove</button
					>
				</form>
			</li>
		{/each}
	</ul>
{/if}

<h2 class="subtitle mt-6">Reset password</h2>

<form method="POST" action="?/resetPassword" class="box" style="max-width: 30rem;">
	<p class="mb-3">
		Enter your current password and choose a new one.
	</p>

	{#if form?.passwordError}
		<p class="help is-danger" role="alert">{form.passwordError}</p>
	{/if}
	{#if form?.passwordSuccess}
		<p class="help is-success" role="status">Password updated.</p>
	{/if}

	<div class="field">
		<label class="label" for="current">Current password</label>
		<div class="control">
			<input class="input" id="current" name="current" type="password" required />
		</div>
	</div>

	<div class="field">
		<label class="label" for="newPassword">New password</label>
		<div class="control">
			<input class="input" id="newPassword" name="newPassword" type="password" required />
		</div>
	</div>

	<div class="field">
		<label class="label" for="confirm-new">Confirm new password</label>
		<div class="control">
			<input class="input" id="confirm-new" name="confirm" type="password" required />
		</div>
	</div>

	<div class="control">
		<button class="button is-primary" type="submit">Update password</button>
	</div>
</form>

<h2 class="subtitle mt-6">Delete account</h2>

<form
	method="POST"
	action="?/deleteAccount"
	class="box danger-zone"
	style="max-width: 30rem;"
	on:submit={(e) => {
		if (!confirm('Delete your account? This permanently removes your notes and categories.')) {
			e.preventDefault();
		}
	}}
>
	<p class="mb-3">
		Deleting your account permanently removes your notes, your categories and
		your sign-in. This cannot be undone.
	</p>

	{#if form?.deleteError}
		<p class="help is-danger" role="alert">{form.deleteError}</p>
	{/if}

	<div class="field">
		<label class="label" for="password">Confirm your password</label>
		<div class="control">
			<input class="input" id="password" name="password" type="password" required />
		</div>
	</div>

	<div class="field">
		<label class="label" for="confirm">Type DELETE to confirm</label>
		<div class="control">
			<input
				class="input"
				id="confirm"
				name="confirm"
				type="text"
				required
				autocomplete="off"
				placeholder="DELETE"
			/>
		</div>
	</div>

	<div class="control">
		<button class="button is-danger" type="submit">Delete my account</button>
	</div>
</form>

<style>
	.danger-zone {
		border: 1px solid var(--bulma-danger);
	}
</style>
