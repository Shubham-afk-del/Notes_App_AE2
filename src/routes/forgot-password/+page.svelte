<script>
	export let form;
</script>

<svelte:head>
	<title>Forgot password - Notes App</title>
</svelte:head>

<div class="auth-bg">
	<form method="POST" class="box">
		<h1 class="title">Reset password</h1>

		<p class="mb-4">
			Enter your username and a new password to reset your account password.
		</p>

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
			<label class="label" for="password">New password</label>
			<div class="control">
				<input class="input" id="password" name="password" type="password" required />
			</div>
		</div>

		<div class="field">
			<label class="label" for="confirm">Confirm new password</label>
			<div class="control">
				<input class="input" id="confirm" name="confirm" type="password" required />
			</div>
		</div>

		<div class="control">
			<button class="button is-primary" type="submit">Reset password</button>
		</div>

		<p class="mt-3">
			Remember password? <a href="/login">Back to login</a>.
		</p>
	</form>
</div>
