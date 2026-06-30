<script>
	export let user;
</script>

<nav class="navbar" aria-label="Main navigation">
	<div class="container">
		<div class="navbar-brand">
			<a class="navbar-item has-text-weight-bold" href="/">Notes App</a>
		</div>
		<div class="navbar-menu is-active">
			<div class="navbar-start">
				<a class="navbar-item" href="/">Home</a>
				<a class="navbar-item" href="/help">Help</a>
				{#if user}
					<a class="navbar-item" href="/settings">Settings</a>
				{/if}
			</div>
			<div class="navbar-end">
				{#if user}
					<span class="navbar-item">Signed in as {user}</span>
					<div class="navbar-item">
						<form method="POST" action="/logout">
							<button class="button is-light" type="submit">Log out</button>
						</form>
					</div>
				{:else}
					<a class="navbar-item" href="/login">Log in</a>
					<a class="navbar-item" href="/register">Register</a>
				{/if}
			</div>
		</div>
	</div>
</nav>
