<script>
	export let note;
	$: preview = note.body.length > 140 ? note.body.slice(0, 140) + '...' : note.body;
</script>

<article class="box note-card">
	<h2 class="title is-5">
		<a href="/notes/{note.id}">{note.title}</a>
	</h2>
	<p>{preview}</p>
</article>
