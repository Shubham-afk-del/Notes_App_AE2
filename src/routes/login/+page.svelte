<script>
	import { page } from '$app/stores';
	export let form;
	$: resetOk = $page.url.searchParams.get('reset') === '1';
</script>

<svelte:head>
	<title>Log in - Notes App</title>
</svelte:head>

<div class="auth-bg">
	<form method="POST" class="box">
		<h1 class="title">Log in</h1>

		{#if resetOk}
			<p class="help is-success" role="status">
				Password updated. Please log in with your new password.
			</p>
		{/if}

		{#if form?.error}
			<p class="help is-danger" role="alert">{form.error}</p>
		{/if}

		<div class="field">
			<label class="label" for="username">Username</label>
			<div class="control">
				<input
					class="input"
					id="username"
					name="username"
					type="text"
					required
					value={form?.username ?? ''}
				/>
			</div>
		</div>

		<div class="field">
			<label class="label" for="password">Password</label>
			<div class="control">
				<input class="input" id="password" name="password" type="password" required />
			</div>
		</div>

		<p class="forgot-password">
			<a href="/forgot-password">Forgot password?</a>
		</p>

		<div class="control">
			<button class="button is-primary" type="submit">Log in</button>
		</div>

		<p class="mt-3">No account? <a href="/register">Register here</a>.</p>
	</form>
</div>

<style>
	.forgot-password {
		margin-top: -0.5rem;
		margin-bottom: 1rem;
		text-align: right;
	}

	.forgot-password a {
		font-size: 0.9rem;
	}
</style>