<script>
	import '$lib/app.css';
	import Nav from '$lib/components/Nav.svelte';

	export let data;
</script>

<!-- skip link: lets keyboard users jump past the nav straight to the content -->
<a class="skip-link" href="#main">Skip to main content</a>

<header>
	<Nav user={data.user} />
</header>

<main id="main" class="section" class:app-bg={data.user}>
	<div class="container">
		<slot />
	</div>
</main>

<footer class="footer">
	<div class="content has-text-centered">
		<p>
			<a href="/help">Help</a> &middot;
			<a href="/about">About</a> &middot;
			<a href="/contact">Contact</a>
		</p>
		<p>Made in the UK❤️</p>
	</div>
</footer>
