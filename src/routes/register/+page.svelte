<script>
	export let form;
</script>

<svelte:head>
	<title>Register - Notes App</title>
</svelte:head>

<div class="auth-bg">
	<form method="POST" class="box">
		<h1 class="title">Create an account</h1>
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
			<p class="help">3-20 characters: letters, numbers and underscores.</p>
		</div>
		<div class="field">
			<label class="label" for="password">Password</label>
			<div class="control">
				<input class="input" id="password" name="password" type="password" required />
			</div>
			<p class="help">At least 5 characters.</p>
		</div>
		<div class="control">
			<button class="button is-primary" type="submit">Register</button>
		</div>
		<p class="mt-3">Already have an account? <a href="/login">Log in here</a>.</p>
	</form>
</div>
